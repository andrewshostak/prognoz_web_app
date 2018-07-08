export class Team {
    id: number;
    name: string;
    image: string;
    caption: string;
    club_id: number;
    captain_id: number;
    stated: boolean;
    confirmed: boolean;
    team_participants: Array<any>;
    club: any;
}
