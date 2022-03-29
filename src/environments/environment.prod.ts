/* tslint:disable:object-literal-sort-keys */
declare const process: any;

export const environment = {
   production: true,
   imageURL: 'https://api.prognoz.org.ua/img',
   apiUrl: 'https://api.prognoz.org.ua/api/',
   pusherApiKey: process.env.PUSHER_API_KEY
};
