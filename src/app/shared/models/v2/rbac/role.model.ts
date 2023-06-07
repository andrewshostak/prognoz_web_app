import { Permission } from '@models/v2/rbac/permission.model';

export class Role {
   id: number;
   slug: string;

   permissions?: Permission[];
}
