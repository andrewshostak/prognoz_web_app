import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PermissionGuard } from '@app/manage/shared/permission-guard.service';
import { CompetitionCreateComponent } from './competition-create/competition-create.component';
import { CompetitionEditComponent } from './competition-edit/competition-edit.component';
import { CompetitionTableComponent } from './competition-table/competition-table.component';
import { ManageCompetitionComponent } from './manage-competition.component';

const routes: Routes = [
   {
      path: 'competitions',
      component: ManageCompetitionComponent,
      canActivate: [PermissionGuard],
      data: { permissions: ['create_competition', 'update_competition', 'delete_competition'] },
      children: [
         { path: 'page/:number', component: CompetitionTableComponent },
         {
            path: 'create',
            component: CompetitionCreateComponent,
            canActivate: [PermissionGuard],
            data: { permissions: ['create_competition'] }
         },
         {
            path: ':id/edit',
            component: CompetitionEditComponent,
            canActivate: [PermissionGuard],
            data: { permissions: ['update_competition'] }
         },
         { path: '', component: CompetitionTableComponent }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageCompetitionRoutingModule {}
