export const environment = {
    production: false,
    apiUrl: 'http://prognoz-rest.local/api/',
    apiImageNews: 'http://prognoz-rest.local/img/news/',
    apiImageClubs: 'http://prognoz-rest.local/img/clubs/',
    apiImageUsers: 'http://prognoz-rest.local/img/users/',
    apiImageAwards: 'http://prognoz-rest.local/img/awards/',
    apiImageTeams: 'http://prognoz-rest.local/img/teams/',
    imageUserDefault: 'default.png',
    imageTeamDefault: 'default.jpeg',
    imageSettings: {
        club: { maxSize: 204800, types: ['image/gif', 'image/png'] },
        user: { maxSize: 524288, types: ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'] },
        news: { maxSize: 524288, types: ['image/jpg', 'image/jpeg', 'image/png'] },
        team: { maxSize: 524288, types: ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'] }
    },
    tournaments: {
        championship: {
            id: 1
        },
        cup: {
            id: 2
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
