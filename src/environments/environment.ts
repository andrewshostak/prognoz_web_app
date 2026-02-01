/* tslint:disable:object-literal-sort-keys */
declare const process: any;

export const environment = {
   production: false,
   imageBaseUrl: 'https://api.prognoz.org.ua/img',
   apiBaseUrl: 'https://api.prognoz.org.ua/api',
   pusherApiKey: process.env.PUSHER_API_KEY,
   reCaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
};
