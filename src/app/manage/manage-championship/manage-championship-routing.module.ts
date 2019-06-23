import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionshipMatchCreateComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-create/championship-match-create.component';
import { ChampionshipMatchEditComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-edit/championship-match-edit.component';
import { ChampionshipMatchTableComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-table/championship-match-table.component';
import { ManageChampionshipMatchComponent } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.component';
import { ManageChampionshipMatchGuard } from '@app/manage/manage-championship/manage-championship-match/shared/manage-championship-match-guard.service.service';
import { ManageChampionshipComponent } from '@app/manage/manage-championship/manage-championship.component';
import { ManageChampionshipGuard } from '@app/manage/manage-championship/shared/manage-championship-guard.service.service';

const routes: Routes = [
   {
      canActivate: [ManageChampionshipGuard],
      canActivateChild: [ManageChampionshipGuard],
      children: [
         {
            canActivateChild: [ManageChampionshipMatchGuard],
            children: [
               { path: 'page/:pageNumber', component: ChampionshipMatchTableComponent },
               { path: 'create', component: ChampionshipMatchCreateComponent },
               { path: ':id', component: ChampionshipMatchEditComponent },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
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
