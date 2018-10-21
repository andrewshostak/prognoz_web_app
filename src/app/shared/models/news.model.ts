export class News {
    id: number;
    title: string;
    body: string;
    image: string;
    tournament_id: number;
    author_id: number;
    tournament: any;
    created_at: string;
    author: {
        name: string;
        image: string;
    };
}
