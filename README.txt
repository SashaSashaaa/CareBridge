Щоб сайт почав працювати, потрібно:

---- Відкрити папку Backend редакторі коду(і створити термінал) :
		Написати команди:
	1. py -m venv venv (для Windows)  ||  python3 -m venv venv (для Macos)
	2. .\venv\Scripts\activate (для Windows)  ||  source ./venv/bin/activate (для Macos)
	3. pip install -r req.txt
	4. cd ./server
		// створення бд в PostgreSQL
	5. createdb -U [username] carebridge
	6. psql -U [username] -d carebridge -f carebridge_dump1.sql

		Зайдіть у файл за шляхом backend/server/.env і за інструкціями знайдіть і вставте ваші API ключі

		Зайдіть у файл за шляхом backend/server/server/settings.py і пролистайте до 127 рядка. 
	  Заповніть поля відносно вашого акаунта PostgreSQL. Наприклад:

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": "carebridge",
            "USER": " імʼя ",         # Введіть ваше ім'я користувача PostgreSQL
            "PASSWORD": " пароль ",         # Введіть ваш пароль PostgreSQL
            "HOST": "localhost",
            "PORT": "5432",
        }
    }

	7. py manage.py runserver (для Windows)  ||  python3 manage.py runserver (для Macos)



---- Відкрити папку Frontend в терміналі або редакторі коду(і створити термінал) :
		Написати команди:
	1. npm i
	2. npm run dev
