import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleGuard } from '@app/manage/shared/role-guard.service';
import { CompetitionCreateComponent } from './competition-create/competition-create.component';
import { CompetitionEditComponent } from './competition-edit/competition-edit.component';
import { CompetitionTableComponent } from './competition-table/competition-table.component';
import { ManageCompetitionComponent } from './manage-competition.component';

const routes: Routes = [
   {
      path: 'competitions',
      component: ManageCompetitionComponent,
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['competitions_editor'] },
      children: [
         { path: 'page/:number', component: CompetitionTableComponent, data: { roles: ['competitions_editor'] } },
         { path: 'create', component: CompetitionCreateComponent, data: { roles: ['competitions_editor'] } },
         { path: ':id/edit', component: CompetitionEditComponent, data: { roles: ['competitions_editor'] } },
         { path: '', component: CompetitionTableComponent, data: { roles: ['competitions_editor'] } }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageCompetitionRoutingModule {}
