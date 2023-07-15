# Prognoz Web App - web application with tournaments for football forecasters

[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/andrewshostak/prognoz_web_app/blob/master/README.md)
[![ua](https://img.shields.io/badge/lang-ua-yellow.svg)](https://github.com/andrewshostak/prognoz_web_app/blob/master/README.ua.md)

## Table of contents

-  [General info](#general-info)
-  [Technologies](#technologies)
-  [Setup](#setup)

## General info

**Prognoz** - a project of tournaments for football forecasters. Created, working, and complementing since 2016.
The project is non-profitable - all work of developers and administrators is volunteered.
The main diversity of the project is the ability to change a forecast on the match until a specific minute, depending on various tournament conditions.
There are different types of tournaments - individual and team.
A simplified principle of work can be described as follows:

-  administrators add matches to forecast
-  players add and change their forecasts
-  administrators add results of the matches
-  system calculates points and ratings, compares points, withdraw players, etc.

## Technologies

The project **Prognoz** uses a [client-server architecture](https://en.wikipedia.org/wiki/Client%E2%80%93server_model).
Respectively, this GitHub repository contains a web application that is a client.
The web application is built on the popular frontend framework [Angular](https://github.com/angular/angular).
The following libraries used as well:

-  [bootstrap](https://github.com/twbs/bootstrap) / [ng-bootstrap](https://github.com/ng-bootstrap/ng-bootstrap) / [bootswatch](https://github.com/thomaspark/bootswatch/)
-  [ng-select](https://github.com/ng-select/ng-select)
-  [angular2-notifications](https://github.com/flauc/angular2-notifications)
-  [chart.js](https://github.com/chartjs/Chart.js) / [ng2-charts](https://github.com/valor-software/ng2-charts#readme)
-  [fingerprintjs2](https://github.com/fingerprintjs/fingerprintjs)
-  [moment](https://github.com/moment/moment/)
-  [lodash](https://github.com/lodash/lodash)
-  [quill](https://github.com/quilljs/quill) / [ngx-quill](https://github.com/KillerCodeMonkey/ngx-quill)
-  [pusher-js](https://github.com/pusher/pusher-js)

A server-side part of the code is placed in a separate [repository](https://github.com/andrewshostak/prognoz_v2_rest).

## Setup

The web application could be run locally or in the [Docker](https://docs.docker.com/).
In both options, the web application uses the next environment variables:

| Environment variable | Required | Description                   | Example                   |
| -------------------- | -------- | ----------------------------- | ------------------------- |
| API_BASE_URL         | +        | Base URL of server-side API   | http://localhost:8000/api |
| IMAGE_BASE_URL       | +        | Base URL of images            | http://localhost:8000/img |
| PUSHER_API_KEY       | -        | The kee for users-online list |                           |
| RECAPTCHA_SITE_KEY   | -        | The kee for captcha           |                           |

### Locally

1. Install [node](https://nodejs.org/en/about) and [npm](https://docs.npmjs.com/about-npm)  
   Install `node` of version [14.7](https://nodejs.org/dist/v14.7.0/) according to your platform.
   During the installation of `node`, `npm` will be installed automatically.
1. Make sure that `node` and `npm` are installed  
   Both console commands `node -v` `npm -v` should output versions. For example `v14.17.4` and `6.14.14`.
1. Install [Angular-CLI](https://angular.io/cli)  
   Run `npm install -g @angular/cli@10.2.1` command.
1. Make sure that `Angular-CLI` is installed  
   Run `ng version` command. It should print meaningful information.
1. Install dependencies  
   Run `npm ci` command from the project root. The folder `node_modules` should appear afterward.
1. Launch web application  
   Run `ng serve` command with previously set environment variables. The web application will be automatically rebuilt with each code change.
1. Open web application  
   Go to http://localhost:4200/ in your browser.

Other useful command:

-  `ng test` - run tests.
-  `ng generate component|directive|pipe|service|class|guard|interface|enum|module element-name` - generate a new element.
-  `ng build` - build the project.

### In Docker

1. Install dependencies  
   Run `docker run --rm --interactive --tty --volume $PWD:/app --workdir /app node:14.17.4-alpine npm ci` command.
1. Launch web application  
   Run `docker-compose -f docker-compose.dev.yml up web_app_dev` command.
   The web application will be automatically rebuilt with each code change.
1. Open web application  
   Go to http://localhost:4200/ in your browser.
