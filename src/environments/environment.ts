/* tslint:disable:object-literal-sort-keys */
declare const process: any;

export const environment = {
   production: false,
   imageURL: 'http://localhost:8000/img',
   apiUrl: 'http://localhost:8000/api/',
   pusherApiKey: process.env.PUSHER_API_KEY
};
