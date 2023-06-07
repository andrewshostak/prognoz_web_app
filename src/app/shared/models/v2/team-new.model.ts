/* tslint:disable:variable-name */
import { ClubNew } from '@models/v2/club-new.model';
import { User } from '@models/user.model';

export class TeamNew {
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
   club: ClubNew;
}
