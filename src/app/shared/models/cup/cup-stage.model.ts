export class CupStage {
    id: number;
    competition_id: number;
    cup_stage_type_id: number;
    round: number;
    title: string;
    active: boolean;
    ended: boolean;
    competition: {
        title: string;
    };
    cup_stage_type: {
        title: string;
    };
    cup_matches: {
        id: number;
    }[];
    cup_cup_matches: {
        id: number;
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
        home: number;
        away: number;
        score: string;
    }[];
}
