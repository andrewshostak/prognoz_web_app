export const environment = {
    production: true,
    apiUrl: 'https://api.prognoz.org.ua/api/',
    apiImageNews: 'https://api.prognoz.org.ua/img/news/',
    apiImageClubs: 'https://api.prognoz.org.ua/img/clubs/',
    apiImageUsers: 'https://api.prognoz.org.ua/img/users/',
    apiImageAwards: 'https://api.prognoz.org.ua/img/awards/',
    apiImageTeams: 'https://api.prognoz.org.ua/img/teams/',
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
        apiKey: 'd0200d5a8e86a9d21577'
    }
};
