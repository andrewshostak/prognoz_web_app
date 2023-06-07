/* tslint:disable:variable-name */
import { ClubNew } from '@models/v2/club-new.model';
import { Role } from '@models/v2/rbac/role.model';
import { WinNew } from '@models/v2/win-new.model';

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
