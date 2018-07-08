export class TeamMatch {
    id: number;
    competition_id: number;
    round: number;
    t1_id: number;
    t2_id: number;
    home: number;
    away: number;
    number_in_competition: number;
    number_in_round: number;
    starts_at: string;
    predictions: number;
    points: number;
    dc: number;
    guessed: number;
    blocked: number;
    active: boolean;
    ended: boolean;
    is_predictable: boolean;
    club_first: any;
    club_second: any;
    team_predictions: any;
}
