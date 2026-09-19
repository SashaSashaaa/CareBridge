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

# --- Попередження про застарілий фронтенд -----------------------------------
# Цей скрипт оновлює ЛИШЕ бекенд. React збирається на Mac і приїжджає rsync-ом,
# тому зміни у frontend/ самі тут не з'являться. Порівнюємо час збірки з часом
# останнього коміту, що чіпав фронтенд, і голосно попереджаємо про розбіжність.

FRONT_COMMIT=$(sudo -u carebridge git -C "$APP" log -1 --format=%ct -- \
    frontend/src frontend/public frontend/index.html frontend/package.json 2>/dev/null || echo 0)
DIST_BUILT=$(stat -c %Y "$APP/frontend/dist/index.html" 2>/dev/null || echo 0)

if [ "$FRONT_COMMIT" -gt "$DIST_BUILT" ]; then
    echo
    echo "⚠️  УВАГА: фронтенд на сервері застарів"
    echo "   Останній коміт із змінами React: $(date -d "@$FRONT_COMMIT" '+%Y-%m-%d %H:%M')"
    echo "   Збірка, яку віддає nginx:        $(date -d "@$DIST_BUILT" '+%Y-%m-%d %H:%M')"
    echo
    echo "   Цей скрипт React не збирає. Виконайте НА MAC:"
    echo "       bash ~/Documents/Projects/Competition/CareBridge/deploy/release.sh"
fi
