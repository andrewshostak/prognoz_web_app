import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageMatchComponent } from '@app/manage/manage-match/manage-match.component';
import { MatchCreateComponent } from '@app/manage/manage-match/match-create/match-create.component';
import { MatchEditComponent } from '@app/manage/manage-match/match-edit/match-edit.component';
import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { PermissionGuard } from '@app/manage/shared/permission-guard.service';

const routes: Routes = [
   {
      canActivate: [PermissionGuard],
      data: { permissions: ['create_match', 'update_match', 'delete_match'] },
      children: [
         { path: 'page/:pageNumber', component: MatchTableComponent },
         { path: 'create', component: MatchCreateComponent, canActivate: [PermissionGuard], data: { permissions: ['create_match'] } },
         { path: ':id', component: MatchEditComponent, canActivate: [PermissionGuard], data: { permissions: ['update_match'] } },
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
