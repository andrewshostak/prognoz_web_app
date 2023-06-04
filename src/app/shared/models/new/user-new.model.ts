/* tslint:disable:variable-name */
import { ClubNew } from '@models/new/club-new.model';
import { Role } from '@models/new/rbac/role.model';
import { WinNew } from '@models/new/win-new.model';

export class UserNew {
   created_at: string;
   first_name: string;
   hometown: string;
   id: number;
   image: string;
   name: string;

   roles?: Role[];
   clubs?: ClubNew[];
   main_club?: ClubNew[];
   winners?: WinNew[];
}
