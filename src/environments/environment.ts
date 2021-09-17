/* tslint:disable:object-literal-sort-keys */
export const environment = {
   production: false,
   imageURL: 'http://localhost:8000/img',
   apiUrl: 'http://localhost:8000/api/',
   apiImageNews: 'http://localhost:8000/img/news/',
   apiImageUsers: 'http://localhost:8000/img/users/',
   apiImageAwards: 'http://localhost:8000/img/awards/',
   imageUserDefault: 'default.png',
   imageSettings: {
      club: { maxSize: 204800, types: ['image/png'] },
      user: { maxSize: 524288, types: ['image/png', 'image/jpg', 'image/jpeg'] },
      news: { maxSize: 524288, types: ['image/jpg', 'image/jpeg', 'image/png'] },
      team: { maxSize: 524288, types: ['image/png', 'image/jpg', 'image/jpeg'] }
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
