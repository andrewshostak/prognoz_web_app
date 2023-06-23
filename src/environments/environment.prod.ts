/* tslint:disable:object-literal-sort-keys */
declare const process: any;

export const environment = {
   production: true,
   imageBaseUrl: process.env.IMAGE_BASE_URL,
   apiBaseUrl: process.env.API_BASE_URL,
   pusherApiKey: process.env.PUSHER_API_KEY,
   reCaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
};
