import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionshipMatchCreateComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-create/championship-match-create.component';
import { ChampionshipMatchEditComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-edit/championship-match-edit.component';
import { ChampionshipMatchTableComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-table/championship-match-table.component';
import { ManageChampionshipMatchComponent } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.component';
import { ManageChampionshipComponent } from '@app/manage/manage-championship/manage-championship.component';
import { PermissionGuard } from '@app/manage/shared/permission-guard.service';

const routes: Routes = [
   {
      children: [
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_championship_match', 'update_championship_match', 'delete_championship_match'] },
            children: [
               { path: 'page/:pageNumber', component: ChampionshipMatchTableComponent },
               {
                  path: 'create',
                  component: ChampionshipMatchCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_championship_match'] }
               },
               {
                  path: ':id',
                  component: ChampionshipMatchEditComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['update_championship_match'] }
               },
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
