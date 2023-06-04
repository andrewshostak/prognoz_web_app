import { Permission } from '@models/new/rbac/permission.model';

export class Role {
   id: number;
   slug: string;

   permissions?: Permission[];
}
