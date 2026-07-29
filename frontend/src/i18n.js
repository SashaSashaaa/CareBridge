import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import CreateArticlePage from "./Pages/ArticlePage/CreateArticlePage";
import CreateVolunteerPage from "./Pages/VolunteerPage/CreateVolunteerPage";

const resources = {
  uk: {
    translation: {
      home: "Головна",
      about: "Про нас",
      volunteer: "Волонтерство",
      psychologist: "Психолог",
      login: "Увійти",
      signup: "Реєстрація",
      logout: "Вийти",
      profile: "Профіль",

      // auth
      noaccount: "Немає облікового запису?",
      haveaccount: "Вже маєте обліковий запис?",
      loginname: "Логін",
      email: "Е-пошта",
      firstname: "Ім'я",
      lastname: "Прізвище",
      password: "Пароль",
      confirmpassword: "Повторіть пароль",

      //pages

      //main/volu
      thisSiteEtc: "!!! Цей сайт тестовий, створений у навчальних цілях !!!",
      search: "Пошук",
      searchPlaceholder: "Пошук...",

      //about

      aboutHeroTitle: "Про CareBridge",
      aboutHeroText:
        "CareBridge — це платформа, яка об’єднує людей, волонтерів та психологічну підтримку в одному місці. Тут можна знайти допомогу, підтримку або долучитися до корисних ініціатив.",
      aboutHeroBtnVolunteer: "Перейти до волонтерств",

      aboutStat1Title: "Доступність",
      aboutStat1Text:
        "Платформа працює постійно і доступна з будь-якого пристрою",
      aboutStat2Title: "Можливості",
      aboutStat2Text: "Волонтерство, статті та підтримка в одному місці",
      aboutStat3Title: "Простота",
      aboutStat3Text: "Зрозумілий інтерфейс без зайвих складнощів",

      aboutWhatWeDo: "Що ми робимо",
      aboutWhatWeDoText:
        "Ми створюємо простий і зручний сервіс, де можна знайти допомогу або допомогти іншим.",

      aboutDirection1Title: "Волонтерство",
      aboutDirection1Text:
        "Можна знайти актуальні ініціативи, долучитися до допомоги або створити власну картку.",

      aboutDirection2Title: "Психологічна підтримка",
      aboutDirection2Text:
        "Є можливість отримати базову психологічну допомогу та не залишатися наодинці.",

      aboutDirection3Title: "Спільнота",
      aboutDirection3Text:
        "Платформа об’єднує людей, які хочуть допомагати та підтримувати один одного.",

      aboutValuesBadge: "Цінності",
      aboutValues: "Що для нас важливо",

      aboutValue1Title: "Люди",
      aboutValue1Text: "На першому місці — люди та їхні потреби.",

      aboutValue2Title: "Співпраця",
      aboutValue2Text: "Допомога працює краще, коли люди об’єднуються.",

      aboutValue3Title: "Довіра",
      aboutValue3Text: "Відкрита інформація та чесна взаємодія.",

      aboutValue4Title: "Простота",
      aboutValue4Text: "Сервіс має бути зрозумілим для кожного.",

      aboutHowItWorks: "Як це працює",
      aboutHowItWorksText: "Все максимально просто і швидко.",

      aboutStep1Title: "Обери",
      aboutStep1Text: "Знайди потрібну категорію або скористайся пошуком.",

      aboutStep2Title: "Переглянь",
      aboutStep2Text: "Відкрий картку та ознайомся з інформацією.",

      aboutStep3Title: "Дій",
      aboutStep3Text: "Допоможи, зв’яжись або створи власну ініціативу.",

      aboutWhyImportant: "Чому це важливо",
      aboutWhyImportantText:
        "Людям важливо швидко знаходити допомогу та підтримку. CareBridge робить це простішим.",

      aboutCtaTitle: "Приєднуйся до CareBridge",
      aboutCtaText: "Створи акаунт і почни користуватися платформою вже зараз.",
      aboutCtaButton: "Зареєструватися",

      //volu
      volunteerPageTitle: "Волонтерство",
      volunteerPageText:
        "Знайди волонтерство та ініціативи, які можуть допомогти саме тобі.",

      articlePageTitle: "Статті",
      articlePageText: "Знайди статті, або створи власні.",

      storyPageTitle: "Історії добра",
      storyPageText: "Поділися власною історією добра з іншими.",

      volunteerLoadError: "Помилка завантаження",
      volunteerNoResults: "Нічого не знайдено",

      //main
      mainHeroTitle:
        "CareBridge — платформа підтримки, допомоги та волонтерства",
      mainHeroText:
        "Зручний цифровий простір, де люди можуть знайти допомогу, психологічну підтримку та волонтерські ініціативи в одному місці.",
      mainHeroBtn1: "Знайти волонтерів",
      mainHeroBtn2: "Зареєструватися",

      mainMiniCard1Title: "Простір підтримки",
      mainMiniCard1Text:
        "Допомога, взаємодія та корисні ініціативи зібрані в одному сервісі.",
      mainMiniCard2Title: "Швидкий старт",
      mainMiniCard2Text: "Пошук, волонтери та підтримка без зайвих кроків.",

      mainBadgeSupport: "Підтримка",
      mainBadgeSearch: "Швидкий пошук",
      mainBadgeSafe: "Безпечний простір",

      mainAudienceTitle: "Для кого ця платформа",
      mainAudienceText:
        "CareBridge створена для різних користувачів, щоб кожен міг знайти потрібний формат підтримки.",
      mainAudience1Title: "Для тих, хто шукає допомогу",
      mainAudience1Text:
        "Можна швидко знайти корисні контакти, волонтерів і можливості підтримки.",
      mainAudience2Title: "Для волонтерів",
      mainAudience2Text:
        "Платформа дає змогу долучатися до ініціатив і допомагати тим, хто цього потребує.",
      mainAudience3Title: "Для тих, кому потрібна підтримка",
      mainAudience3Text:
        "Тут можна знайти базову психологічну допомогу та не залишатися наодинці.",
      mainAudience4Title: "Для нових ініціатив",
      mainAudience4Text:
        "Сервіс підходить для об’єднання людей навколо корисних справ і взаємодії.",

      mainSearchLabel: "Пошук",
      mainSearchTitle: "Знайди волонтера вже зараз",
      mainSearchText:
        "Скористайся швидким пошуком і одразу переходь до потрібних людей або до повного списку.",

      mainHowTitle: "Як це працює",
      mainHow1Title: "Створи акаунт",
      mainHow1Text:
        "Зареєструйся та обери зручний спосіб взаємодії з платформою.",
      mainHow2Title: "Знайди потрібне",
      mainHow2Text:
        "Скористайся пошуком, переглядай волонтерів та доступні можливості.",
      mainHow3Title: "Отримай підтримку",
      mainHow3Text:
        "Спілкуйся, залишай заявки або долучайся до допомоги іншим.",

      mainVolunteersTitle: "Волонтери на платформі",
      mainVolunteersText:
        "Кілька користувачів, які вже представлені в сервісі.",
      mainViewAll: "Переглянути всіх",

      mainStats1: "Волонтерів",
      mainStats2: "Користувачів",
      mainStats3: "Заявок",
      mainStats4: "Ініціатив",

      mainCtaTitle: "Стань частиною CareBridge",
      mainCtaText:
        "Приєднуйся до спільноти, де допомога, підтримка та взаємодія стають ближчими для кожного.",
      mainCtaButton: "Почати зараз",

      article: "Статті",
      volunteer: "Волонтерство",

      emptyAnswer: "Відповідь порожня",
      errorPsychologist: "Сталася помилка при зверненні до психолога",
      writeProblems: "Напиши, що тебе турбує.",
      writeProblemsPlaceholder: "Напиши, що тебе турбує...",
      sendingPlaceholder: "Надсилання...",
      sendBtn: "Надіслати",

      infoArticle: "Детальна інформація про статтю",
      infoStory: "Детальна інформація про історію добра",
      infoVolunteer: "Детальна інформація про волонтерство",
      description: "Опис",
      mainInfo: "Основна інформація",
      name: "Назва",
      createdat: "Дата створення",
      author: "Автор",

      stories: "Історії добра",

      personalInfoAnd: "Особиста інформація та ваше волонтерство",
      yourInfo: "Особиста інформація",
      myVolunteering: "Моє волонтерство",
      myArticles: "Мої статті",
      myStories: "Мої історії добра",
      total: "Усього:",
      addVolunteering: "Додати волонтерство",
      addArticle: "Додати статтю",
      addStory: "Додати історію",
      addFirstVolu: "Додати перше волонтерство",
      addFirstArticle: "Додати першу статтю",
      addFirstStory: "Додати першу історію",
      open: "Відкрити",
      edit: "Відредагувати",
      all: "Всі",
      delete: "Видалити",

      createVolunteering: "Створити волонтество",
      createArticle: "Створити статтю",
      createStory: "Створити історію",
      titleCard: "Назва",
      titleCardPlaceholder: "Введіть назва",
      category: "Категорія",
      descriptionPlaceholderCreate: "Введіть опис...",
      shortDescriptionETC: "Короткий опис - пишеться на картці",
      image: "Зображення",

      loading: "Завантаження...",
      chooseCategory: "Оберіть категорію",

      ad: "Реклама",

      confirmed: "Підтверджено",
      checking: "На модерації",

      aiSupport: "ШІ Підтримка",

      aiSupportAuthRequired:
        "Щоб користуватися ШІ-підтримкою, потрібно зареєструватися або увійти в акаунт.",

      game: "ШІ Гра",

      chat: "Чат",
      selectChatToStart: "Обери чат для спілкування",
      myChats: "Мої чати",
      user: "Користувач",
      noMessages: "Немає повідомлень",
      noChatsYet: "Чатів поки немає",
      users: "Користувачі",

      all: "Всі",
      allowed: "Дозволені",
      pending: "Очікують",
      searchUser: "Пошук користувача...",
      open: "Відкрити",
      cancel: "Скасувати",
      accept: "Прийняти",
      no: "Ні",
      write: "Написати",
      nothingFound: "Нічого не знайдено",

      online: "online",
      offline: "offline",
      userTyping: "{{user}} друкує...",
      writeMessage: "Напиши повідомлення...",
      send: "Надіслати",

      game1DescriptionTitle: "🎮 Гра про волонтерство у сфері програмування",
      game1DescriptionIntroStart: "У цій грі ти виступаєш у ролі",
      game1DescriptionRole: "координатора волонтерських ресурсів",
      game1TasksTitle: "🎯 Твої задачі:",
      game1TaskEarn: "заробляти біткоїни у вікторині 💰",
      game1TaskDistribute: "розподіляти їх між напрямками:",
      game1AiDescription:
        "Покращення AI прискорює роботу транспорту до 30% і збільшує енергоефективність до 40%",
      game1TransportTitle: "🚚 Транспорт",
      game1TransportDescription: "Оптимізація перевезень, аналітика",
      game1EcoTitle: "🌱 Екологія",
      game1EcoDescription: "Зменшення витрат і викидів",
      game1GoalTitle: "🚀 Мета:",
      game1GoalText: "максимально розвинути кожен напрямок (по 20 біткоїнів).",
      game1ReportHint: "📊 Після кожного кроку ти отримуєш звіт.",
      startGame: "Почати 🚀",

      gameOverTitle: "🎉 Гру завершено! 🎉",
      gameOverCongratsStart:
        "🚀 Вітаємо! Ви успішно пройшли гру з волонтерства",
      gameOverProgramming: "у програмуванні",
      gameOverDescription:
        "🧠 Ви приймали стратегічні рішення, 📦 ефективно керували ресурсами 🇺🇦 та допомогли забезпечити стабільність країни!",
      yourReport: "Ваш звіт:",
      gameOverGoodJob: "💙 Ви — молодець!",
      gameOverRealLife:
        "🌍 У реальному житті теж можна стати волонтером та змінювати світ на краще!",
      gameOverEveryAction: "✨ Кожна дія має значення ✨",

      notEnoughPoints: "Ви не можете виділити більше грошей ніж у Вас є",
      processingRound: "⚙️ Обробка раунду...",
      controlPanel: "🎮 Панель керування. Доступні поінти:",
      remaining: "Залишок",
      startRound: "🚀 Запустити раунд",
      round: "Раунд",
      gameFinished: "Гра завершена",
      income: "Дохід",
      saving: "Економія",
      totalIncome: "Загальний дохід",
      totalSaving: "Загальні заощадження",
      sectorsProgress: "📊 Прогрес секторів",
      report: "📄 Звіт",
      requestError: "Помилка запиту. Спробуйте ще раз",

      travelDescriptionTitle: "🌍 Гра про туристичні подорожі",
      travelDescriptionIntro:
        "У цій грі ти керуєш туристичною компанією та створюєш ідеальні подорожі для клієнтів.",
      travelDescriptionTask: "Твоя задача — розподіляти бали між напрямками:",
      travelDirectionDestinations: "• 🌍 Напрямки (destinations)",
      travelDirectionComfort: "• ✈️ Комфорт подорожі (comfort)",
      travelDirectionExperience: "• ⭐ Враження туристів (experience)",
      travelRoundDescription:
        "Кожен раунд — це нова подорож з випадковим напрямком, сезоном і ризиками.",
      travelDecisionsDepend: "Від твоїх рішень залежить:",
      travelCompanyProfit: "• 💰 Прибуток компанії",
      travelTouristRating: "• ⭐ Рейтинг туристів",
      travelBalanceText:
        "Балансуй інвестиції, враховуй сезонність і намагайся створити найкращий туристичний досвід!",
      travelReportHint:
        "Наприкінці кожного раунду ти отримаєш звіт про результати подорожі.",
      ok: "OK",

      travelGameOverTitle: "🤝 Місію завершено!",
      travelGameOverContributionStart: "💙 Ви зробили величезний внесок як",
      travelGameOverVolunteer: "волонтер",
      travelGameOverDescription:
        "📦 Ваші рішення допомогли людям, 🏥 покращили умови життя та 🌍 вплинули на світ навколо вас.",
      travelGameOverResultStart:
        "🚀 Завдяки вашим вкладенням ресурси були використані ефективно, і це призвело до",
      travelGameOverStrongResults: "сильних та позитивних результатів",
      yourContribution: "Ваш внесок:",
      travelGameOverGoodJob: "🌟 Ви — приклад справжньої допомоги!",
      travelGameOverContinueGood:
        "🙌 Навіть маленькі дії можуть змінювати життя людей. Продовжуйте робити добро!",
      travelGameOverTogether: "💛 Разом ми можемо більше 💛",

      notEnoughPointsTravel: "Недостатньо балів",
      planningTrip: "✈️ Плануємо подорож...",
      travelManagerTitle: "🌍 Туристичний менеджер | Балів:",
      destinationsCounter: "🌍 Напрямки",
      comfortCounter: "🛏 Комфорт",
      experienceCounter: "🎯 Досвід",
      startTour: "🚀 Запустити тур",
      profit: "Прибуток",
      rating: "Рейтинг",
      totalProfit: "Загальний прибуток",
      averageRating: "Середній рейтинг",
      progress: "📊 Прогрес",
      destinations: "Напрямки",
      comfort: "Комфорт",
      experience: "Досвід",

      game3DescriptionTitle: "🌱 Симулятор екосистеми",
      game3DescriptionIntro:
        "У цій грі ти керуєш розвитком ферми та впливаєш на стан довкілля.",
      game3DescriptionBalance:
        "Твої рішення допомагають не лише отримувати дохід, а й підтримувати баланс екосистеми.",
      game3DistributeResources: "Розподіляй ресурси між напрямками:",
      game3PlantsDescription: "• 🌿 Рослини — основа врожаю та прибутку",
      game3WaterDescription: "• 💧 Вода — підтримує життя та екологію",
      game3AutomationDescription:
        "• 🤖 Автоматизація — підвищує ефективність ферми",
      game3RandomEvents:
        "🌦 Кожен раунд супроводжується випадковими подіями, які можуть як допомогти, так і зашкодити.",
      game3ActionsMatter:
        "🤝 Твої дії мають значення: правильний баланс ресурсів сприяє відновленню рослинності та покращенню стану природи.",
      game3FinalReport:
        "Наприкінці ти отримаєш звіт про прибуток і екологічний вплив.",
      startFarmingGame: "Почати 🌾",

      game3OverTitle: "🌍 Екосезон завершено!",
      game3OverThanksStart: "🤝 Завдяки вашим",
      game3OverVolunteerContributions: "волонтерським внескам",
      game3OverThanksEnd:
        "навколишнє середовище стало зеленішим та здоровішим.",
      game3OverDescription:
        "🌱 Ви допомагали відновлювати рослинність, 💧 підтримували водні ресурси 🤖 та впроваджували розумні рішення для сталого розвитку.",
      game3OverBalanceText:
        "🌿 Ваші дії сприяли відновленню природного балансу: більше рослин → чистіше повітря → стабільніша екосистема.",
      ecosystemImpact: "Вплив на екосистему:",
      game3OverGoodJob: "🌸 Ви зробили вагомий внесок у природу!",
      game3OverRealLife:
        "🌍 У реальному житті навіть невеликі дії можуть відновлювати екосистеми та підтримувати біорізноманіття.",
      game3OverFuture: "🌱 Разом ми створюємо зелене майбутнє 🌱",

      notEnoughResources: "Недостатньо ресурсів",
      processingSeason: "🌾 Обробка сезону...",
      farmingSimulatorTitle: "🌱 Фермерський симулятор | Ресурси:",
      plantsCounter: "🌿 Рослини",
      waterCounter: "💧 Вода",
      automationCounter: "🤖 Автоматизація",
      startSeason: "🚜 Запустити сезон",
      event: "Подія",
      eco: "Еко",
      totalEco: "Загальна еко",
      plants: "🌿 Рослини",
      water: "💧 Вода",
      automation: "🤖 Автоматизація",

      gameStartMainTitle:
        "Волонтерство — це мистецтво покращувати світ, вкладаючи гроші та зусилля в інших!",
      chooseGameDirection: "Оберіть напрямок гри:",
      becomeVirtualVolunteer: "Ставайте віртуальним волонтером!",

      programming: "Програмування",
      tourism: "Туризм",
      planting: "Садівництво",

      programmingTopicAlgorithms: "Алгоритми та логіка",
      programmingTopicPython: "Основи програмування на Python",
      programmingTopicComputerStructure: "Будова комп’ютера",
      programmingTopicOperatingSystems: "Операційні системи (Windows, Linux)",
      programmingTopicInternetBrowsers: "Інтернет та браузери",
      programmingTopicSecurity: "Комп’ютерна безпека (віруси, антивіруси)",
      programmingTopicHistoryIT: "Відомі програмісти та історія IT",
      programmingTopicLanguages: "Мови програмування",
      programmingTopicFilesData: "Робота з файлами і даними",
      programmingTopicAI: "Штучний інтелект (базові поняття)",

      tourismTopicTypes: "Види туризму (гірський, морський, екологічний)",
      tourismTopicCountriesCapitals: "Країни та столиці світу (топ 50)",
      tourismTopicClimateWeather: "Клімат і погода",
      tourismTopicOrientation: "Орієнтування на місцевості (карта, компас)",
      tourismTopicBehaviorRules: "Правила поведінки туриста",
      tourismTopicUkraineTravel: "Подорожі Україною",
      tourismTopicTransport: "Транспорт у подорожах",
      tourismTopicCultures: "Культура та традиції різних народів",
      tourismTopicSafety: "Безпека під час подорожей",
      tourismTopicLandmarks: "Визначні пам’ятки світу",

      plantingTopicPlantsStructure: "Рослини та їх будова",
      plantingTopicGrowthConditions: "Умови росту рослин (світло, вода, ґрунт)",
      plantingTopicVegetablesFruits: "Овочі та фрукти",
      plantingTopicPlantCare: "Догляд за рослинами",
      plantingTopicPests: "Шкідники та захист рослин",
      plantingTopicSeasonalWorks: "Сезонні роботи в саду",
      plantingTopicGreenhouses: "Теплиці та парники",
      plantingTopicFertilizersSoils: "Добрива та ґрунти",
      plantingTopicOrganicFarming: "Екологічне землеробство",
      plantingTopicGrowingTrees: "Вирощування дерев",

      volunteerOverlayTitle: "🤝 Як волонтерство змінює життя",
      volunteerOverlayText1:
        "💙 Волонтерство — це не лише допомога іншим, а й потужний інструмент особистого розвитку.",
      volunteerOverlayText2:
        "👥 Ви знайомитесь із новими людьми, отримуєте досвід та відчуваєте значущість своєї діяльності.",
      volunteerOverlayText3: "🌱 Допомагаючи іншим, ви змінюєте світ і себе.",
      volunteerOverlayText4: "✨ Кожен маленький крок — це велика зміна.",
      close: "Закрити",

      quiz: "Вікторина",
      gameTopBar: "Гра",
      login_to_like: "Будь ласка, увійдіть, щоб поставити лайк.",
      confirm_delete: "Ви точно хочете видалити цю історію?",
      author: "Автор",
      no_description: "Опис відсутній",
      likes: "Лайки",
      edit: "Редагувати",
      delete: "Видалити",
    },
  },
  en: {
    translation: {
      home: "Home",
      about: "About",
      volunteer: "Volunteer",
      psychologist: "Psychologist",
      login: "Log in",
      signup: "Sign up",
      logout: "Logout",
      profile: "Profile",
      // auth

      noaccount: "Don't have an account?",
      haveaccount: "Already have an account?",
      loginname: "Login",
      email: "Email",
      firstname: "First name",
      lastname: "Last name",
      password: "Password",
      confirmpassword: "Confirm Password",

      //pages

      //main/volu
      thisSiteEtc:
        "!!! This site is a test site, created for educational purposes !!!",
      search: "Search",
      searchPlaceholder: "Search...",

      //about
      aboutHeroTitle: "About CareBridge",
      aboutHeroText:
        "CareBridge is a platform that connects people, volunteers, and psychological support in one place. Here you can find help, get support, or join useful initiatives.",
      aboutHeroBtnVolunteer: "Go to volunteering",

      aboutStat1Title: "Accessibility",
      aboutStat1Text: "The platform is available anytime from any device",
      aboutStat2Title: "Opportunities",
      aboutStat2Text: "Volunteering, articles, and support in one place",
      aboutStat3Title: "Simplicity",
      aboutStat3Text: "Clear and easy-to-use interface",

      aboutWhatWeDo: "What we do",
      aboutWhatWeDoText:
        "We create a simple and удобний service where you can find help or help others.",

      aboutDirection1Title: "Volunteering",
      aboutDirection1Text:
        "You can find initiatives, join activities, or create your own listing.",

      aboutDirection2Title: "Psychological support",
      aboutDirection2Text:
        "Users can get basic emotional support and not stay alone with their problems.",

      aboutDirection3Title: "Community",
      aboutDirection3Text:
        "The platform brings together people who want to help and support each other.",

      aboutValuesBadge: "Values",
      aboutValues: "What matters to us",

      aboutValue1Title: "People",
      aboutValue1Text: "People and their needs come first.",

      aboutValue2Title: "Cooperation",
      aboutValue2Text: "Help works better when people unite.",

      aboutValue3Title: "Trust",
      aboutValue3Text: "Open information and honest interaction.",

      aboutValue4Title: "Simplicity",
      aboutValue4Text: "The service should be easy to use for everyone.",

      aboutHowItWorks: "How it works",
      aboutHowItWorksText: "Everything is simple and fast.",

      aboutStep1Title: "Choose",
      aboutStep1Text: "Find a category or use search.",

      aboutStep2Title: "View",
      aboutStep2Text: "Open a card and read the details.",

      aboutStep3Title: "Act",
      aboutStep3Text: "Help, contact, or create your own initiative.",

      aboutWhyImportant: "Why it matters",
      aboutWhyImportantText:
        "People need quick access to help and support. CareBridge makes it easier.",

      aboutCtaTitle: "Join CareBridge",
      aboutCtaText: "Create an account and start using the platform.",
      aboutCtaButton: "Sign up",

      //volu
      volunteerPageTitle: "Volunteers",
      volunteerPageText:
        "Find out about volunteering and initiatives that can help you.",

      articlePageTitle: "Articles",
      articlePageText: "Find out the necessary confusion, or create power.",

      storyPageTitle: "Kindness Stories",
      storyPageText: "Share the powerful story of kindness with others.",

      volunteerNoResults: "Nothing found",
      volunteerDetails: "Details",

      //main
      mainHeroTitle:
        "CareBridge — a platform for support, help, and volunteering",
      mainHeroText:
        "A convenient digital space where people can find help, psychological support, and volunteer initiatives in one place.",
      mainHeroBtn1: "Find volunteers",
      mainHeroBtn2: "Sign up",

      mainMiniCard1Title: "Support space",
      mainMiniCard1Text:
        "Help, interaction, and useful initiatives gathered in one service.",
      mainMiniCard2Title: "Quick start",
      mainMiniCard2Text: "Search, volunteers, and support without extra steps.",

      mainBadgeSupport: "Support",
      mainBadgeSearch: "Fast search",
      mainBadgeSafe: "Safe space",

      mainAudienceTitle: "Who this platform is for",
      mainAudienceText:
        "CareBridge is built for different users so everyone can find the right format of support.",
      mainAudience1Title: "For people looking for help",
      mainAudience1Text:
        "You can quickly find useful contacts, volunteers, and support opportunities.",
      mainAudience2Title: "For volunteers",
      mainAudience2Text:
        "The platform allows people to join initiatives and help those who need it.",
      mainAudience3Title: "For those who need support",
      mainAudience3Text:
        "Here you can find basic psychological help and not stay alone with your worries.",
      mainAudience4Title: "For new initiatives",
      mainAudience4Text:
        "The service is suitable for bringing people together around useful activities and interaction.",

      mainSearchLabel: "Search",
      mainSearchTitle: "Find a volunteer right now",
      mainSearchText:
        "Use quick search and immediately go to the right people or to the full list.",

      mainHowTitle: "How it works",
      mainHow1Title: "Create an account",
      mainHow1Text:
        "Sign up and choose the most convenient way to interact with the platform.",
      mainHow2Title: "Find what you need",
      mainHow2Text:
        "Use search, browse volunteers, and explore available opportunities.",
      mainHow3Title: "Get support",
      mainHow3Text: "Communicate, submit requests, or help others.",

      mainVolunteersTitle: "Volunteers on the platform",
      mainVolunteersText: "A few users already represented in the service.",
      mainViewAll: "View all",

      mainStats1: "Volunteers",
      mainStats2: "Users",
      mainStats3: "Requests",
      mainStats4: "Initiatives",

      mainCtaTitle: "Become a part of CareBridge",
      mainCtaText:
        "Join a community where help, support, and interaction become closer for everyone.",
      mainCtaButton: "Get started",

      article: "Articles",
      volunteer: "Volunteers",

      emptyAnswer: "The answer is empty",
      errorPsychologist: "An error occurred when contacting a psychologist",
      writeProblems: "Write what is bothering you.",
      writeProblemsPlaceholder: "Write what is bothering you...",
      sendingPlaceholder: "Sending...",
      sendBtn: "Send",

      infoArticle: "Detailed information about the article",
      infoVolunteer: "Detailed information about the volunteering",
      description: "Description",
      mainInfo: "Main information",
      name: "Name",
      createdat: "Date of creation",
      author: "Author",

      stories: "Kindness Stories",

      personalInfoAnd: "Personal information and your volunteering",
      yourInfo: "Personal information",
      lastName: "Last name",
      myVolunteering: "My volunteering",
      myArticles: "My articles",
      total: "Total:",
      addVolunteering: "Add volunteering",
      addArticle: "Add article",
      addStory: "Add story",
      addFirstVolu: "Add first volunteering",
      addFirstArticle: "Add first article",
      addFirstStory: "Add first story",
      open: "Open",
      edit: "Edit",
      all: "All",
      delete: "Delete",

      createVolunteering: "Create volunteering",
      createArticle: "Create article",
      createStory: "Create story",
      titleCard: "Title",
      titleCardPlaceholder: "Enter a title...",
      category: "Category",
      descriptionPlaceholderCreate: "Enter a description...",
      shortDescriptionETC: "Short description - written on the card",
      image: "Image",

      loading: "Loading...",
      chooseCategory: "Choose a category",

      ad: "Advertising",

      confirmed: "Confirmed✅",
      checking: "Checking...",

      aiSupport: "AI Support",

      aiSupportAuthRequired:
        "To use AI support, you need to sign up or log in to your account.",

      game: "GameAI",

      chat: "Chat",
      selectChatToStart: "Select a chat to start messaging",
      myChats: "My chats",
      user: "User",
      noMessages: "No messages",
      noChatsYet: "No chats yet",

      users: "Users",
      allowed: "Allowed",
      pending: "Pending",
      searchUser: "Search user...",
      open: "Open",
      cancel: "Cancel",
      accept: "Accept",
      no: "No",
      write: "Write",
      nothingFound: "Nothing found",

      user: "User",
      online: "online",
      offline: "offline",
      userTyping: "{{user}} is typing...",
      writeMessage: "Write a message...",
      send: "Send",

      game1DescriptionTitle: "🎮 Programming volunteering game",
      game1DescriptionIntroStart: "In this game, you act as a",
      game1DescriptionRole: "volunteer resources coordinator",
      game1TasksTitle: "🎯 Your tasks:",
      game1TaskEarn: "earn bitcoins in the quiz 💰",
      game1TaskDistribute: "distribute them between areas:",
      game1AiDescription:
        "Improving AI speeds up transport operations by up to 30% and increases energy efficiency by up to 40%",
      game1TransportTitle: "🚚 Transport",
      game1TransportDescription: "Transport optimization and analytics",
      game1EcoTitle: "🌱 Ecology",
      game1EcoDescription: "Reducing costs and emissions",
      game1GoalTitle: "🚀 Goal:",
      game1GoalText: "fully develop each area (20 bitcoins each).",
      game1ReportHint: "📊 After each step, you receive a report.",
      startGame: "Start 🚀",

      gameOverTitle: "🎉 Game completed! 🎉",
      gameOverCongratsStart:
        "🚀 Congratulations! You successfully completed the volunteering game",
      gameOverProgramming: "in programming",
      gameOverDescription:
        "🧠 You made strategic decisions, 📦 managed resources effectively 🇺🇦 and helped ensure the country's stability!",
      yourReport: "Your report:",
      gameOverGoodJob: "💙 Great job!",
      gameOverRealLife:
        "🌍 In real life, you can also become a volunteer and change the world for the better!",
      gameOverEveryAction: "✨ Every action matters ✨",

      notEnoughPoints: "You cannot allocate more money than you have",
      processingRound: "⚙️ Processing round...",
      controlPanel: "🎮 Control panel. Available points:",
      remaining: "Remaining",
      startRound: "🚀 Start round",
      round: "Round",
      gameFinished: "Game finished",
      income: "Income",
      saving: "Saving",
      totalIncome: "Total income",
      totalSaving: "Total savings",
      sectorsProgress: "📊 Sectors progress",
      report: "📄 Report",
      requestError: "Request error. Please try again",

      travelDescriptionTitle: "🌍 Travel game",
      travelDescriptionIntro:
        "In this game, you manage a travel company and create perfect trips for clients.",
      travelDescriptionTask: "Your task is to distribute points between areas:",
      travelDirectionDestinations: "• 🌍 Destinations",
      travelDirectionComfort: "• ✈️ Travel comfort",
      travelDirectionExperience: "• ⭐ Tourist experience",
      travelRoundDescription:
        "Each round is a new trip with a random destination, season, and risks.",
      travelDecisionsDepend: "Your decisions affect:",
      travelCompanyProfit: "• 💰 Company profit",
      travelTouristRating: "• ⭐ Tourist rating",
      travelBalanceText:
        "Balance investments, consider seasonality, and try to create the best travel experience!",
      travelReportHint:
        "At the end of each round, you will receive a report about the trip results.",
      ok: "OK",

      travelGameOverTitle: "🤝 Mission completed!",
      travelGameOverContributionStart: "💙 You made a huge contribution as a",
      travelGameOverVolunteer: "volunteer",
      travelGameOverDescription:
        "📦 Your decisions helped people, 🏥 improved living conditions, and 🌍 influenced the world around you.",
      travelGameOverResultStart:
        "🚀 Thanks to your investments, resources were used effectively, and this led to",
      travelGameOverStrongResults: "strong and positive results",
      yourContribution: "Your contribution:",
      travelGameOverGoodJob: "🌟 You are an example of real help!",
      travelGameOverContinueGood:
        "🙌 Even small actions can change people's lives. Keep doing good!",
      travelGameOverTogether: "💛 Together we can do more 💛",

      notEnoughPointsTravel: "Not enough points",
      planningTrip: "✈️ Planning the trip...",
      travelManagerTitle: "🌍 Travel manager | Points:",
      destinationsCounter: "🌍 Destinations",
      comfortCounter: "🛏 Comfort",
      experienceCounter: "🎯 Experience",
      startTour: "🚀 Start tour",
      profit: "Profit",
      rating: "Rating",
      totalProfit: "Total profit",
      averageRating: "Average rating",
      progress: "📊 Progress",
      destinations: "Destinations",
      comfort: "Comfort",
      experience: "Experience",

      game3DescriptionTitle: "🌱 Ecosystem simulator",
      game3DescriptionIntro:
        "In this game, you manage farm development and influence the state of the environment.",
      game3DescriptionBalance:
        "Your decisions help not only earn income, but also maintain the balance of the ecosystem.",
      game3DistributeResources: "Distribute resources between areas:",
      game3PlantsDescription: "• 🌿 Plants — the basis of harvest and profit",
      game3WaterDescription: "• 💧 Water — supports life and ecology",
      game3AutomationDescription: "• 🤖 Automation — increases farm efficiency",
      game3RandomEvents:
        "🌦 Each round includes random events that can either help or harm.",
      game3ActionsMatter:
        "🤝 Your actions matter: the right balance of resources helps restore vegetation and improve the state of nature.",
      game3FinalReport:
        "At the end, you will receive a report about profit and ecological impact.",
      startFarmingGame: "Start 🌾",

      game3OverTitle: "🌍 Eco season completed!",
      game3OverThanksStart: "🤝 Thanks to your",
      game3OverVolunteerContributions: "volunteer contributions",
      game3OverThanksEnd: "the environment became greener and healthier.",
      game3OverDescription:
        "🌱 You helped restore vegetation, 💧 supported water resources 🤖 and introduced smart solutions for sustainable development.",
      game3OverBalanceText:
        "🌿 Your actions helped restore natural balance: more plants → cleaner air → a more stable ecosystem.",
      ecosystemImpact: "Ecosystem impact:",
      game3OverGoodJob: "🌸 You made a significant contribution to nature!",
      game3OverRealLife:
        "🌍 In real life, even small actions can restore ecosystems and support biodiversity.",
      game3OverFuture: "🌱 Together we create a green future 🌱",

      notEnoughResources: "Not enough resources",
      processingSeason: "🌾 Processing season...",
      farmingSimulatorTitle: "🌱 Farming simulator | Resources:",
      plantsCounter: "🌿 Plants",
      waterCounter: "💧 Water",
      automationCounter: "🤖 Automation",
      startSeason: "🚜 Start season",
      event: "Event",
      eco: "Eco",
      totalEco: "Total eco",
      plants: "🌿 Plants",
      water: "💧 Water",
      automation: "🤖 Automation",

      gameStartMainTitle:
        "Volunteering is the art of improving the world by investing money and effort in others!",
      chooseGameDirection: "Choose a game direction:",
      becomeVirtualVolunteer: "Become a virtual volunteer!",

      programming: "Programming",
      tourism: "Tourism",
      planting: "Gardening",

      programmingTopicAlgorithms: "Algorithms and logic",
      programmingTopicPython: "Basics of Python programming",
      programmingTopicComputerStructure: "Computer structure",
      programmingTopicOperatingSystems: "Operating systems (Windows, Linux)",
      programmingTopicInternetBrowsers: "Internet and browsers",
      programmingTopicSecurity:
        "Computer security (viruses, antivirus software)",
      programmingTopicHistoryIT: "Famous programmers and IT history",
      programmingTopicLanguages: "Programming languages",
      programmingTopicFilesData: "Working with files and data",
      programmingTopicAI: "Artificial intelligence (basic concepts)",

      tourismTopicTypes: "Types of tourism (mountain, sea, ecological)",
      tourismTopicCountriesCapitals:
        "Countries and capitals of the world (top 50)",
      tourismTopicClimateWeather: "Climate and weather",
      tourismTopicOrientation: "Orientation in the area (map, compass)",
      tourismTopicBehaviorRules: "Tourist behavior rules",
      tourismTopicUkraineTravel: "Traveling around Ukraine",
      tourismTopicTransport: "Transport during trips",
      tourismTopicCultures: "Cultures and traditions of different nations",
      tourismTopicSafety: "Travel safety",
      tourismTopicLandmarks: "World landmarks",

      plantingTopicPlantsStructure: "Plants and their structure",
      plantingTopicGrowthConditions:
        "Plant growth conditions (light, water, soil)",
      plantingTopicVegetablesFruits: "Vegetables and fruits",
      plantingTopicPlantCare: "Plant care",
      plantingTopicPests: "Pests and plant protection",
      plantingTopicSeasonalWorks: "Seasonal garden work",
      plantingTopicGreenhouses: "Greenhouses and hotbeds",
      plantingTopicFertilizersSoils: "Fertilizers and soils",
      plantingTopicOrganicFarming: "Organic farming",
      plantingTopicGrowingTrees: "Growing trees",

      volunteerOverlayTitle: "🤝 How volunteering changes lives",
      volunteerOverlayText1:
        "💙 Volunteering is not only about helping others, but also a powerful tool for personal growth.",
      volunteerOverlayText2:
        "👥 You meet new people, gain experience, and feel the importance of your work.",
      volunteerOverlayText3:
        "🌱 By helping others, you change the world and yourself.",
      volunteerOverlayText4: "✨ Every small step is a big change.",
      close: "Close",

      quiz: "Quiz",
      gameTopBar: "Game",
      login_to_like: "Please log in to like this story.",
      confirm_delete: "Are you sure you want to delete this story?",
      author: "Author",
      no_description: "No description available",
      likes: "Likes",
      edit: "Edit",
      delete: "Delete",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "uk",
  fallbackLng: "uk",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
