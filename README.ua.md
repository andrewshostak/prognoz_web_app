# Prognoz Web App - веб застосунок турнірів для футбольних прогнозистів

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/andrewshostak/prognoz_web_app/blob/master/README.md)

## Зміст

-  [Загальна інформація](#загальна-інформація)
-  [Технології](#технології)
-  [Запуск](#запуск)

## Загальна інформація

**Prognoz** - проект турнірів для футбольних прогнозистів. Створений, працює і доповнюється з 2016 року.
Проект не комерційний - вся робота розробників і адміністраторів є добровільною.
Основоною відмінністю проекту є можливість змінювати прогноз на матч до певної хвилини в залежності від різних умов турніру.
Є різні типи турнірів - індивідуальні і командні.
Спрощено принцип роботи можна описати так:

-  адміністратори добавляють матчі для прогнозування
-  гравці добавляють і змінюють прогнози
-  адміністратори добавляють результат матчу
-  система робить обрахування очок, рейтингів, порівняння показників і т.д.

## Технології

Проект **Prognoz** використовує [клієнт-серверну архітектуру](https://uk.wikipedia.org/wiki/%D0%9A%D0%BB%D1%96%D1%94%D0%BD%D1%82-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BD%D0%B0_%D0%B0%D1%80%D1%85%D1%96%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%B0).
Відповідно, цей GitHub репозиторій містить веб-застосунок, який є клієнтом.
Веб-застосунок збудовано на популярному фронтендному фреймворку [Angular](https://github.com/angular/angular).
Також використовуються наступні бібліотеки:

-  [bootstrap](https://github.com/twbs/bootstrap) / [ng-bootstrap](https://github.com/ng-bootstrap/ng-bootstrap) / [bootswatch](https://github.com/thomaspark/bootswatch/)
-  [ng-select](https://github.com/ng-select/ng-select)
-  [angular2-notifications](https://github.com/flauc/angular2-notifications)
-  [chart.js](https://github.com/chartjs/Chart.js) / [ng2-charts](https://github.com/valor-software/ng2-charts#readme)
-  [fingerprintjs2](https://github.com/fingerprintjs/fingerprintjs)
-  [moment](https://github.com/moment/moment/)
-  [lodash](https://github.com/lodash/lodash)
-  [quill](https://github.com/quilljs/quill) / [ngx-quill](https://github.com/KillerCodeMonkey/ngx-quill)
-  [pusher-js](https://github.com/pusher/pusher-js)

Код серверної частини знаходиться в окремому [репозиторії](https://github.com/andrewshostak/prognoz_v2_rest).

## Запуск

Веб застосунок можна запустити як локально, так і у [Докері](https://docs.docker.com/).
В обох способах застосунок використовує наступні змінні середовища:

| Назва змінної      | Обовязковість | Опис                                                  | Приклад                   |
| ------------------ | ------------- | ----------------------------------------------------- | ------------------------- |
| API_BASE_URL       | +             | URL серверної частнини проекту                        | http://localhost:8000/api |
| IMAGE_BASE_URL     | +             | URL зображень                                         | http://localhost:8000/img |
| PUSHER_API_KEY     | -             | Ключ необхідний для роботи списку користувачів онлайн |                           |
| RECAPTCHA_SITE_KEY | -             | Ключ необхідний для роботи капчі                      |                           |

### Локально

1. Встановіть [node](https://nodejs.org/uk/about) і [npm](https://docs.npmjs.com/about-npm)  
   Встановіть `node` версії [14.7](https://nodejs.org/dist/v14.7.0/) відповідно до вашої платформи.
   При встановленні `node`, `npm` буде встановлено автоматично.
1. Переконайтесь що `node` і `npm` встановлено  
   Обидві консольні команди повинні показувати версію: `node -v` `npm -v`. Наприклад `v14.17.4` і `6.14.14`.
1. Встановіть [Angular-CLI](https://angular.io/cli)  
   Запустіть команду `npm install -g @angular/cli@10.2.1`.
1. Переконайтесь що `Angular-CLI` встановлено  
   Запустіть команду `ng version`. Вона повинна виводити значущу інформацію.
1. Завантажте залежності  
   Запустіть команду `npm ci` з кореня проекту. Після цього повинна появитись папка `node_modules`.
1. Запустіть веб-застосунок  
   Запустіть команду `ng serve`, вказавши змінні середовища. Веб застосунок буде автоматично перезавантажуватись при будь яких змінах в коді.
1. Відкрийте сайт  
   У вашому браузері перейдіть на адресу http://localhost:4200/

Інші корисні команди:

-  `ng test` - запустити тести.
-  `ng generate component|directive|pipe|service|class|guard|interface|enum|module element-name` - створити новий елемент.
-  `ng build` - збілдити проект.

### В Докері

1. Завантажте залежності  
   Запустіть команду `docker run --rm --interactive --tty --volume $PWD:/app --workdir /app node:14.17.4-alpine npm ci`
1. Запустіть веб-застосунок  
   Запустіть команду `docker-compose -f docker-compose.dev.yml up web_app_dev`.
   Веб застосунок буде автоматично перезавантажуватись при будь яких змінах в коді.
1. Відкрийте сайт  
   У вашому браузері перейдіть на адресу http://localhost:4200/
