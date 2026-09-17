#!/bin/bash
# Повний деплой CareBridge. Запускати НА MAC з будь-якої теки:
#     bash ~/Documents/Projects/Competition/CareBridge/deploy/release.sh
#
# Робить усе за правильним порядком:
#   1. перевіряє, що код запушений у GitHub
#   2. збирає фронтенд і заливає його на сервер
#   3. оновлює бекенд на сервері (git pull, залежності, міграції, рестарт)
#   4. перевіряє, що сайт живий

set -euo pipefail

# Шлях до проєкту рахуємо від самого скрипта — тому тека запуску не має значення
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

SERVER=carebridge
SITE=https://carebridge.cc

echo "→ Перевіряю стан git"
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Є незакомічені зміни:"
    git status --short | sed 's/^/     /'
    echo
    echo "   Фронтенд збереться з поточних файлів, а бекенд сервер візьме з GitHub."
    echo "   Щоб вони не розійшлися — спочатку закомітьте і запуште."
    read -p "   Продовжити попри це? (y/N) " -n 1 -r; echo
    [[ $REPLY =~ ^[Yy]$ ]] || exit 1
fi

git fetch -q origin
BEHIND=$(git rev-list --count origin/main..HEAD)
if [ "$BEHIND" -gt 0 ]; then
    echo "⚠️  $BEHIND коміт(ів) не запушено в GitHub. Сервер їх не побачить."
    echo "   Виконайте: git push"
    exit 1
fi

echo "→ Збираю фронтенд"
cd "$ROOT/frontend"
npm run build 2>&1 | tail -2

echo "→ Заливаю фронтенд на сервер"
rsync -az --delete dist/ "$SERVER:/srv/carebridge/frontend/dist/"
ssh "$SERVER" 'chown -R carebridge:carebridge /srv/carebridge/frontend/dist'

echo "→ Оновлюю бекенд"
ssh "$SERVER" 'carebridge-update'

echo "→ Фінальна перевірка"
for path in "/" "/api/volunteers/" "/controlvolunteer/"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "$SITE$path")
    case "$CODE" in
        200|302) echo "   ✅ $path → $CODE" ;;
        *)       echo "   ❌ $path → $CODE"; exit 1 ;;
    esac
done

echo
echo "🚀 Готово: $SITE"
