/* tslint:disable:object-literal-sort-keys */
export const environment = {
   production: false,
   imageURL: 'http://prognoz-rest.local/img',
   apiUrl: 'http://prognoz-rest.local/api/',
   apiImageNews: 'http://prognoz-rest.local/img/news/',
   apiImageClubs: 'http://prognoz-rest.local/img/clubs/',
   apiImageUsers: 'http://prognoz-rest.local/img/users/',
   apiImageAwards: 'http://prognoz-rest.local/img/awards/',
   apiImageTeams: 'http://prognoz-rest.local/img/teams/',
   imageUserDefault: 'default.png',
   imageTeamDefault: 'default.jpeg',
   imageSettings: {
      club: { maxSize: 204800, types: ['image/png'] },
      user: { maxSize: 524288, types: ['image/png', 'image/jpg', 'image/jpeg'] },
      news: { maxSize: 524288, types: ['image/jpg', 'image/jpeg', 'image/png'] },
      team: { maxSize: 524288, types: ['image/png', 'image/jpg', 'image/jpeg'] }
   },
   tournaments: {
      championship: {
         id: 1
      },
      cup: {
         id: 2,
         places: [
            { id: 1, title: 'Вдома', slug: 'home' },
            { id: 2, title: 'На виїзді', slug: 'away' },
            { id: 3, title: 'Будь-де', slug: 'anywhere' }
         ],
         numberOfMatchesInStage: 8
      },
      team: {
         id: 3,
         participantsInTeam: 4,
         matchesInRound: 12,
         matchesToBlock: 2
      }
   },
   pusher: {
      apiKey: 'no-key-needed-for-development'
   }
};
