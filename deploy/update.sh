#!/bin/bash
# Оновлення CareBridge на сервері після пушу в GitHub.
# Запускати на сервері від root:  bash /srv/carebridge/deploy/update.sh
#
# Робить усе за правильним порядком: код -> залежності -> база -> статика -> рестарт,
# і в кінці перевіряє, що сайт справді відповідає.

set -euo pipefail

APP=/srv/carebridge
cd "$APP"

echo "→ Тягну зміни з GitHub"
sudo -u carebridge git pull --ff-only

echo "→ Залежності"
sudo -u carebridge backend/venv/bin/pip install -q -r backend/req.txt

cd "$APP/backend/server"

echo "→ Міграції"
sudo -u carebridge ../venv/bin/python manage.py migrate --noinput 2>&1 | grep -vE "^$|System check|WARNINGS|ckeditor|CKEditor|cksource|refrain" || true

echo "→ Статика"
sudo -u carebridge ../venv/bin/python manage.py collectstatic --noinput 2>&1 | tail -1

echo "→ Перезапуск"
systemctl restart carebridge
sleep 3

if systemctl is-active --quiet carebridge; then
    echo "✅ служба працює"
else
    echo "❌ служба не піднялася. Останні логи:"
    journalctl -u carebridge -n 25 --no-pager
    exit 1
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 https://carebridge.cc/api/volunteers/)
if [ "$CODE" = "200" ]; then
    echo "✅ сайт відповідає (HTTP $CODE)"
else
    echo "⚠️  сайт віддає HTTP $CODE — перевірте: journalctl -u carebridge -n 30"
    exit 1
fi
