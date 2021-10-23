/* tslint:disable:object-literal-sort-keys */
export const environment = {
   production: false,
   imageURL: 'http://localhost:8000/img',
   apiUrl: 'http://localhost:8000/api/',
   apiImageNews: 'http://localhost:8000/img/news/',
   imageSettings: {
      news: { maxSize: 524288, types: ['image/jpg', 'image/jpeg', 'image/png'] }
   },
   tournaments: {
      championship: {
         // todo: change tournament ids to Tournament enum and remove from both env files
         id: 1
      },
      cup: {
         id: 2,
         numberOfMatchesInStage: 8
      }
   },
   pusher: {
      apiKey: 'no-key-needed-for-development'
   }
};
