FROM node:14.17.4-alpine as builder

RUN npm install @angular/cli@10.2.1 -g

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll=2000", "--port", "4200", "--disable-host-check"]
