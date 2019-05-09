import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageMatchComponent } from '@app/manage/manage-match/manage-match.component';
import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { ManageMatchGuard } from '@app/manage/manage-match/shared/manage-match-guard.service';

const routes: Routes = [
   {
      canActivate: [ManageMatchGuard],
      canActivateChild: [ManageMatchGuard],
      children: [{ path: 'page/:pageNumber', component: MatchTableComponent }, { path: '', redirectTo: 'page/1', pathMatch: 'full' }],
      component: ManageMatchComponent,
      path: 'matches'
   }
];

@NgModule({
   exports: [RouterModule],
   imports: [RouterModule.forChild(routes)]
})
export class ManageMatchRoutingModule {}
