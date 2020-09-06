import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionGuard } from '@app/manage/shared/permission-guard.service';
import { ClubCreateComponent } from './club-create/club-create.component';
import { ClubEditComponent } from './club-edit/club-edit.component';
import { ClubTableComponent } from './club-table/club-table.component';
import { ManageClubComponent } from './manage-club.component';

const routes: Routes = [
   {
      path: 'clubs',
      component: ManageClubComponent,
      canActivate: [PermissionGuard],
      data: { permissions: ['create_club', 'update_club', 'delete_club'] },
      children: [
         { path: 'page/:number', component: ClubTableComponent },
         { path: 'create', component: ClubCreateComponent, canActivate: [PermissionGuard], data: { permissions: ['create_club'] } },
         { path: ':id/edit', component: ClubEditComponent, canActivate: [PermissionGuard], data: { permissions: ['update_club'] } },
         { path: '', component: ClubTableComponent }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageClubRoutingModule {}
