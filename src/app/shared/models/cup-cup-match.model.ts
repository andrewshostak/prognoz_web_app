export class CupCupMatch {
    id: number;
    cup_stage_id: number;
    home_user_id: number;
    away_user_id: number;
    home: number;
    away: number;
    group_number: number;
    home_raitng_points: number;
    away_raitng_points: number;
    home_points: number;
    away_points: number;
    home_dc_sum: number;
    away_dc_sum: number;
    active: boolean;
    ended: boolean;
    cup_stage: {
        id: number;
        title: string
    };
}