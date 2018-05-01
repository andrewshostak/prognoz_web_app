export class CupMatch {
    id: number;
    t1_id: number;
    t2_id: number;
    home: number;
    away: number;
    starts_at: string;
    predictions: number;
    guessed: number;
    points: number;
    dc_sum: number;
    active: boolean;
    ended: boolean;
    club_first: {
        title: string;
        image: string;
    };
    club_second: {
        title: string;
        image: string;
    };
    cup_stages: {
        id: number,
        ended: boolean
    }[];
}
