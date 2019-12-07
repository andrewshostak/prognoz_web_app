import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from '@app/manage/shared/role-guard.service';
import { ClubCreateComponent } from './club-create/club-create.component';
import { ClubEditComponent } from './club-edit/club-edit.component';
import { ClubTableComponent } from './club-table/club-table.component';
import { ManageClubComponent } from './manage-club.component';

const routes: Routes = [
   {
      path: 'clubs',
      component: ManageClubComponent,
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['clubs_editor'] },
      children: [
         { path: 'page/:number', component: ClubTableComponent, data: { roles: ['clubs_editor'] } },
         { path: 'create', component: ClubCreateComponent, data: { roles: ['clubs_editor'] } },
         { path: ':id/edit', component: ClubEditComponent, data: { roles: ['clubs_editor'] } },
         { path: '', component: ClubTableComponent, data: { roles: ['clubs_editor'] } }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageClubRoutingModule {}
