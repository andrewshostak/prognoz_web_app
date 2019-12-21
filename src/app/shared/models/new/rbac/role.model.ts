import { Permission } from '@models/new/rbac/permission.model';

export class Role {
   public id: number;
   public slug: string;

   public permissions?: Permission[];
}
