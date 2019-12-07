import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionshipMatchCreateComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-create/championship-match-create.component';
import { ChampionshipMatchEditComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-edit/championship-match-edit.component';
import { ChampionshipMatchTableComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-table/championship-match-table.component';
import { ManageChampionshipMatchComponent } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.component';
import { ManageChampionshipComponent } from '@app/manage/manage-championship/manage-championship.component';
import { RoleGuard } from '@app/manage/shared/role-guard.service';

const routes: Routes = [
   {
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['championship_match_editor'] },
      children: [
         {
            children: [
               { path: 'page/:pageNumber', component: ChampionshipMatchTableComponent, data: { roles: ['championship_match_editor'] } },
               { path: 'create', component: ChampionshipMatchCreateComponent, data: { roles: ['championship_match_editor'] } },
               { path: ':id', component: ChampionshipMatchEditComponent, data: { roles: ['championship_match_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            data: { roles: ['championship_match_editor'] },
            component: ManageChampionshipMatchComponent,
            path: 'matches'
         },
         { path: '', pathMatch: 'full', redirectTo: 'matches' }
      ],
      component: ManageChampionshipComponent,
      path: 'championship'
   }
];

@NgModule({
   exports: [RouterModule],
   imports: [RouterModule.forChild(routes)]
})
export class ManageChampionshipRoutingModule {}
