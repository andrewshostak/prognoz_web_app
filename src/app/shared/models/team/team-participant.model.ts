export class TeamParticipant {
    id?: number;
    team_id: number;
    user_id: number;
    competition_id?: number;
    captain: boolean;
    confirmed: boolean;
    refused?: boolean;
    user?: any;
}
