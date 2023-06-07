/* tslint:disable:variable-name */
import { Club } from '@models/v2/club.model';
import { User } from '@models/v1/user.model';

export class Team {
   id: number;
   name: string;
   image: string;
   caption: string;
   club_id: number;
   captain_id: number;
   stated: boolean;
   confirmed: boolean;
   created_at: string;
   updated_at: string;

   captain?: User;
   club: Club;
}
