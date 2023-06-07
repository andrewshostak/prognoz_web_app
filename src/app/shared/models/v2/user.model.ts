/* tslint:disable:variable-name */
import { Club } from '@models/v2/club.model';
import { Role } from '@models/v2/rbac/role.model';
import { Win } from '@models/v2/win.model';

export class User {
   created_at: string;
   first_name: string;
   hometown: string;
   id: number;
   image: string;
   name: string;

   roles?: Role[];
   clubs?: Club[];
   main_club?: Club[];
   winners?: Win[];
}
