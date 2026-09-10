# Розгортання CareBridge на сервері

Сервер: `51.38.140.249` (FLEX-Light, Ubuntu 24.04, Польща)
Домен: `carebridge.cc` (Cloudflare)

Схема: nginx приймає запити ззовні → статику фронтенду віддає сам, а `/api/`,
`/ws/`, `/controlVolunteer/` передає в daphne на `127.0.0.1:8000`.
Назовні daphne не дивиться.

---

## 0. Перший вхід і безпека

Виконуєте ви особисто — тут потрібен пароль з листа.

```bash
ssh root@51.38.140.249
```

Одразу змініть root-пароль (той, що прийшов поштою, вважайте скомпрометованим):

```bash
passwd
```

Створіть окремого користувача для застосунку — під root'ом сайт крутитися не повинен:

```bash
adduser --disabled-password --gecos "" carebridge
```

### SSH-ключ

> ⚠️ Наступні три команди виконуються **на вашому Mac**, а НЕ на сервері.
> Перед кожною перевірте запрошення в терміналі: має бути ваш локальний
> користувач, а не `root@carebridge`. Ключ, створений на сервері, доступу
> вашому ноутбуку не дасть.
>
> Зберігати ключ тільки в `~/.ssh/` — ніколи в теці проєкту, інакше
> приватний ключ ризикує потрапити в git.

```bash
ssh-keygen -t ed25519 -C "carebridge-deploy" -f ~/.ssh/carebridge_ed25519
```

```bash
ssh-copy-id -i ~/.ssh/carebridge_ed25519.pub root@51.38.140.249
```

```bash
printf 'Host carebridge\n  HostName 51.38.140.249\n  User root\n  IdentityFile ~/.ssh/carebridge_ed25519\n  IdentitiesOnly yes\n' >> ~/.ssh/config
```

Перевірка — має пустити без пароля:

```bash
ssh carebridge
```

Після того як вхід по ключу працює, вимкніть вхід по паролю — у
`/etc/ssh/sshd_config` поставте `PasswordAuthentication no`, далі `systemctl restart ssh`.

---

## 1. Базове налаштування системи

```bash
apt update && apt upgrade -y
apt install -y python3-venv python3-dev build-essential \
               postgresql postgresql-contrib \
               nginx git \
               libjpeg-dev zlib1g-dev
```

Swap на 2 ГБ — страховка на випадок піків при обробці зображень:

```bash
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

Фаєрвол:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

---

## 2. PostgreSQL

```bash
sudo -u postgres psql
```

У консолі psql (пароль придумайте свій, він знадобиться для `.env`):

```sql
CREATE USER carebridge WITH PASSWORD 'ваш_надійний_пароль';
CREATE DATABASE carebridge OWNER carebridge;
GRANT ALL PRIVILEGES ON DATABASE carebridge TO carebridge;
\q
```

---

## 3. Код на сервер

```bash
mkdir -p /srv && cd /srv
git clone https://github.com/SashaSashaaa/CareBridge.git carebridge
chown -R carebridge:carebridge /srv/carebridge
```

Відновлення бази з дампа:

```bash
sudo -u postgres psql -d carebridge -f /srv/carebridge/backend/server/carebridge_dump1.sql
```

> Якщо посипляться помилки виду `role "postgres" does not exist` або
> `must be owner of table` — дамп містить прив'язку до локального власника.
> Лікується так:
> ```bash
> sed -i 's/OWNER TO postgres/OWNER TO carebridge/g' /srv/carebridge/backend/server/carebridge_dump1.sql
> ```
> і повторіть відновлення.

---

## 4. Віртуальне оточення

```bash
cd /srv/carebridge/backend
sudo -u carebridge python3 -m venv venv
sudo -u carebridge venv/bin/pip install --upgrade pip
sudo -u carebridge venv/bin/pip install -r req.txt
```

На Ubuntu 24.04 тут Python 3.12 — усі пакети з `req.txt` стають з готових
wheel, без збірки з сирців.

---

## 5. Файл .env на сервері

```bash
cd /srv/carebridge/backend/server
sudo -u carebridge cp .env.example .env
sudo -u carebridge nano .env
```

Заповніть так (це прод-значення, вони відрізняються від локальних):

```ini
GEMINI_API_KEY=новий_ключ_з_ai_studio
PIXABAY_KEY=ваш_ключ

DEBUG=False
SECRET_KEY=згенерований_нижче_ключ

ALLOWED_HOSTS=carebridge.cc,www.carebridge.cc
CORS_ALLOWED_ORIGINS=https://carebridge.cc,https://www.carebridge.cc
CSRF_TRUSTED_ORIGINS=https://carebridge.cc,https://www.carebridge.cc

DB_NAME=carebridge
DB_USER=carebridge
DB_PASSWORD=пароль_з_кроку_2
DB_HOST=localhost
DB_PORT=5432
```

Новий `SECRET_KEY` генерується так:

```bash
/srv/carebridge/backend/venv/bin/python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Закрийте файл від сторонніх очей:

```bash
chmod 600 .env && chown carebridge:carebridge .env
```

---

## 6. Міграції та статика

```bash
cd /srv/carebridge/backend/server
sudo -u carebridge ../venv/bin/python manage.py migrate
sudo -u carebridge ../venv/bin/python manage.py collectstatic --noinput
```

`collectstatic` потрібен для CSS адмінки: при `DEBUG=False` Django більше не
роздає статику сам.

---

## 7. Запуск через systemd

```bash
cp /srv/carebridge/deploy/carebridge.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now carebridge
systemctl status carebridge
```

Логи, якщо щось не так:

```bash
journalctl -u carebridge -n 50 --no-pager
```

---

## 8. nginx

```bash
cp /srv/carebridge/deploy/nginx-carebridge.conf /etc/nginx/sites-available/carebridge
ln -s /etc/nginx/sites-available/carebridge /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

---

## 9. Домен у Cloudflare

У панелі Cloudflare, розділ DNS:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | `51.38.140.249` | **DNS only** (сіра хмара) |
| A | `www` | `51.38.140.249` | **DNS only** |

**Проксі поки вимкніть** (сіра хмара) — інакше certbot не зможе підтвердити
домен. Увімкнете після отримання сертифіката.

---

## 10. SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d carebridge.cc -d www.carebridge.cc
```

Certbot сам допише HTTPS-блок у конфіг nginx і налаштує автопродовження.

Після цього можна вмикати проксі Cloudflare (помаранчева хмара). І обов'язково
в розділі **SSL/TLS → Overview** поставте режим **Full (strict)**.

> Режим **Flexible** не вмикайте — Cloudflare ходитиме на сервер по http,
> nginx редіректитиме на https, і сайт піде в нескінченний цикл редіректів.

WebSocket через проксі Cloudflare працює без додаткових налаштувань.

---

## 11. Фронтенд

Збирається **на вашому Mac**, а не на сервері — 1 vCPU там не для цього.

```bash
cd frontend
npm run build
rsync -avz --delete dist/ root@51.38.140.249:/srv/carebridge/frontend/dist/
```

Далі на сервері один раз:

```bash
chown -R carebridge:carebridge /srv/carebridge/frontend/dist
```

Цю ж пару команд повторюєте щоразу, коли міняєте фронтенд.

---

## 12. Перевірка

```bash
systemctl status carebridge nginx    # обидва active (running)
curl -I https://carebridge.cc        # 200 OK
```

У браузері перевірте живими руками:

- відкривається головна;
- працює вхід і адмінка на `https://carebridge.cc/controlVolunteer/`;
- у чаті в консолі браузера видно `Chat WS connected`;
- запускається гра (це перевіряє, що ключ Gemini на сервері робочий);
- зображення в оголошеннях віддаються з `/media/`.

---

## 13. Оновлення після змін у коді

```bash
cd /srv/carebridge
sudo -u carebridge git pull
sudo -u carebridge backend/venv/bin/pip install -r backend/req.txt
cd backend/server
sudo -u carebridge ../venv/bin/python manage.py migrate
sudo -u carebridge ../venv/bin/python manage.py collectstatic --noinput
systemctl restart carebridge
```

---

## 14. Бекапи

Покладіть `deploy/backup.sh` у крон:

```bash
cp /srv/carebridge/deploy/backup.sh /usr/local/bin/carebridge-backup
chmod +x /usr/local/bin/carebridge-backup
crontab -e
```

Рядок для щоденного бекапу о 4:00:

```
0 4 * * * /usr/local/bin/carebridge-backup
```

Бекапи лежать на тому ж диску, тож раз на тиждень копіюйте їх собі:

```bash
rsync -avz root@51.38.140.249:/var/backups/carebridge/ ~/carebridge-backups/
```
