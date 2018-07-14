export class ChampionshipPrediction {
    id?: number;
    user_id?: number;
    match_id: number;
    home: number;
    away: number;
    updated_at?: string;
    match?: {
        number_in_competition: number;
        home: number;
        away: number;
        club_first: {
            title: string;
        };
        club_second: {
            title: string;
        };
    };
}
