import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageMatchComponent } from '@app/manage/manage-match/manage-match.component';
import { MatchCreateComponent } from '@app/manage/manage-match/match-create/match-create.component';
import { MatchEditComponent } from '@app/manage/manage-match/match-edit/match-edit.component';
import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { RoleGuard } from '@app/manage/shared/role-guard.service';

const routes: Routes = [
   {
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['match_editor'] },
      children: [
         { path: 'page/:pageNumber', component: MatchTableComponent, data: { roles: ['match_editor'] } },
         { path: 'create', component: MatchCreateComponent, data: { roles: ['match_editor'] } },
         { path: ':id', component: MatchEditComponent, data: { roles: ['match_editor'] } },
         { path: '', redirectTo: 'page/1', pathMatch: 'full' }
      ],
      component: ManageMatchComponent,
      path: 'matches'
   }
];

@NgModule({
   exports: [RouterModule],
   imports: [RouterModule.forChild(routes)]
})
export class ManageMatchRoutingModule {}
