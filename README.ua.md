# Prognoz Web App

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/andrewshostak/prognoz_web_app/blob/master/README.md)

## Загальна інформація

**Prognoz** - сайт турнірів для футбольних прогнозистів. Створений, працює і доповнюється з 2016 року.
Проект не комерційний - вся робота розробників і адміністраторів є добровільною.
Основоною відмінністю проекту є можливість змінювати прогноз на матч до певної хвилини в залежності від різних умов турніру.
Є різні типи турнірів - індивідуальні і командні.
Спрощено принцип роботи можна описати так:

-  адміністратори добавляють матчі для прогнозування
-  гравці добавляють і змінюють прогнози
-  адміністратори добавляють результат матчу
-  система робить обрахування очок, рейтингів, порівняння показників і т.д.

## Технічна реалізація

Проект **Prognoz** використовує [клієнт-серверну архітектуру](https://uk.wikipedia.org/wiki/%D0%9A%D0%BB%D1%96%D1%94%D0%BD%D1%82-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BD%D0%B0_%D0%B0%D1%80%D1%85%D1%96%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%B0).
Відповідно, цей github-репозиторій містить веб-застосунок, який є клієнтом.
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
