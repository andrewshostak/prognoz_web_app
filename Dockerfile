FROM node:14.17.4-alpine as builder

WORKDIR /app

COPY . .

RUN npm ci

ARG IMAGE_BASE_URL
ARG API_BASE_URL
ARG PUSHER_API_KEY

RUN npm run build -- --configuration=production --aot

FROM nginx:1.10.3

COPY --from=builder /app/dist /var/www/prognoz_web_app
COPY nginx.conf /etc/nginx/conf.d/default.conf
