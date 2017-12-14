export const environment = {
    production: true,
    apiUrl: 'http://46.101.159.170/api/',
    apiImageNews: 'http://46.101.159.170/img/news/',
    apiImageClubs: 'http://46.101.159.170/img/clubs/',
    apiImageUsers: 'http://46.101.159.170/img/users/',
    apiImageAwards: 'http://46.101.159.170/img/awards/',
    apiImageTeams: 'http://46.101.159.170/img/teams/',
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
        team: {
            id: 3,
            participantsInTeam: 4,
            matchesInRound: 12,
            matchesToBlock: 2
        }
    },
    pusher: {
        apiKey: 'd0200d5a8e86a9d21577'
    }
};