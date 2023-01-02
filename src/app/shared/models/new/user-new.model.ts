/* tslint:disable:variable-name */
import { ClubNew } from '@models/new/club-new.model';
import { Role } from '@models/new/rbac/role.model';
import { Win } from '@models/win.model';

export class UserNew {
   public created_at: string;
   public first_name: string;
   public hometown: string;
   public id: number;
   public image: string;
   public name: string;

   public roles?: Role[];
   public clubs?: ClubNew[];
   public main_club?: ClubNew[];
   // todo: temporary, until new model created
   public winners?: Win[];
}
