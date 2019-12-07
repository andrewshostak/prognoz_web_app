import { Role } from '@models/new/rbac/role.model';

export class UserNew {
   public id: number;
   public name: string;

   public roles?: Role[];
}
