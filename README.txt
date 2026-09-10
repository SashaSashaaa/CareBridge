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

		Зробіть копію файлу backend/server/.env.example з іменем .env :
	7. cp .env.example .env (для Macos)  ||  copy .env.example .env (для Windows)

		Відкрийте створений .env і за інструкціями всередині вставте ваші API ключі,
	  а також дані вашого акаунта PostgreSQL (DB_USER, DB_PASSWORD).

		УВАГА: вписуйте ключі тільки у файл .env — він не потрапляє в git.
	  У .env.example ключі вписувати НЕ можна, цей файл відстежується git-ом
	  і будь-який ключ у ньому одразу стане публічним.

	8. py manage.py runserver (для Windows)  ||  python3 manage.py runserver (для Macos)



---- Відкрити папку Frontend в терміналі або редакторі коду(і створити термінал) :
		Написати команди:
	1. npm i
	2. npm run dev
