/* tslint:disable:object-literal-sort-keys */
export const environment = {
   production: true,
   imageURL: 'https://api.prognoz.org.ua/img',
   apiUrl: 'https://api.prognoz.org.ua/api/',
   apiImageNews: 'https://api.prognoz.org.ua/img/news/',
   imageSettings: {
      news: { maxSize: 524288, types: ['image/jpg', 'image/jpeg', 'image/png'] }
   },
   tournaments: {
      championship: {
         id: 1
      },
      cup: {
         id: 2,
         numberOfMatchesInStage: 8
      }
   },
   pusher: {
      apiKey: 'd0200d5a8e86a9d21577'
   }
};
