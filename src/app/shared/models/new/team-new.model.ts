/* tslint:disable:variable-name */
import { Club } from '@models/club.model';
import { User } from '@models/user.model';

export class TeamNew {
   public id: number;
   public name: string;
   public image: string;
   public caption: string;
   public club_id: number;
   public captain_id: number;
   public stated: boolean;
   public confirmed: boolean;
   public created_at: string;
   public updated_at: string;

   public captain?: User;
   public club: Club;
}
