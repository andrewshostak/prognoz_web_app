export class ChampionshipMatch {
    id: number;
    competition_id: number;
    t1_id: number;
    t2_id: number;
    home: number;
    away: number;
    starts_at: string;
    predicts: number;
    points: number;
    dc: number;
    active: boolean;
    ended: boolean;
    championship_predicts: Array<any>;
    club_first: any;
    club_second: any;
}
