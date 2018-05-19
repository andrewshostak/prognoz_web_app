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
    is_predictable: boolean;
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
    home_prediction: string;
    away_prediction: string;
    home_prediction_created_at: string;
    away_prediction_created_at: string;
}
