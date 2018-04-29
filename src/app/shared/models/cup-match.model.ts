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
    };
    club_second: {
        title: string;
    };
    cup_stages: {
        id: number
    }[];
}
