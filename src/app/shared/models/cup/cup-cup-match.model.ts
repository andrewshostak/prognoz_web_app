export class CupCupMatch {
    id: number;
    cup_stage_id: number;
    home_user_id: number;
    away_user_id: number;
    home: number;
    away: number;
    group_number: number;
    home_rating_points: number;
    away_rating_points: number;
    home_points: number;
    away_points: number;
    home_dc_sum: number;
    away_dc_sum: number;
    active: boolean;
    ended: boolean;
    cup_stage: {
        id: number;
        competition_id: number;
        title: string;
        competition: {
            title: string;
        };
        cup_stage_type: {
            title: string;
        };
        ended: boolean;
    };
    home_user: {
        name: string;
        image: string;
        hometown: string;
    };
    away_user: {
        name: string;
        image: string;
        hometown: string;
    };
    score: string;
}
