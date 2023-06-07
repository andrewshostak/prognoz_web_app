/* tslint:disable:variable-name */
export class TeamParticipant {
   id?: number;
   team_id: number;
   user_id: number;
   competition_id?: number;
   captain: boolean;
   confirmed: boolean;
   refused?: boolean;
   ended?: boolean;
   user?: {
      name: string;
      image: string;
   };
   team?: {
      name: string;
   };
   competition?: {
      title: string;
   };
}
