import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CupCupMatchCreateComponent } from '@app/manage/manage-cup/manage-cup-cup-match/cup-cup-match-create/cup-cup-match-create.component';
import { CupCupMatchEditComponent } from '@app/manage/manage-cup/manage-cup-cup-match/cup-cup-match-edit/cup-cup-match-edit.component';
import { CupCupMatchesCreateAutoComponent } from '@app/manage/manage-cup/manage-cup-cup-match/cup-cup-matches-create-auto/cup-cup-matches-create-auto.component';
import { CupCupMatchesTableComponent } from '@app/manage/manage-cup/manage-cup-cup-match/cup-cup-matches-table/cup-cup-matches-table.component';
import { ManageCupCupMatchComponent } from '@app/manage/manage-cup/manage-cup-cup-match/manage-cup-cup-match.component';
import { CupMatchCreateComponent } from '@app/manage/manage-cup/manage-cup-match/cup-match-create/cup-match-create.component';
import { CupMatchEditComponent } from '@app/manage/manage-cup/manage-cup-match/cup-match-edit/cup-match-edit.component';
import { CupMatchTableComponent } from '@app/manage/manage-cup/manage-cup-match/cup-match-table/cup-match-table.component';
import { ManageCupMatchComponent } from '@app/manage/manage-cup/manage-cup-match/manage-cup-match.component';
import { CupStageCreateComponent } from '@app/manage/manage-cup/manage-cup-stage/cup-stage-create/cup-stage-create.component';
import { CupStageEditComponent } from '@app/manage/manage-cup/manage-cup-stage/cup-stage-edit/cup-stage-edit.component';
import { CupStagesTableComponent } from '@app/manage/manage-cup/manage-cup-stage/cup-stages-table/cup-stages-table.component';
import { ManageCupStageComponent } from '@app/manage/manage-cup/manage-cup-stage/manage-cup-stage.component';
import { ManageCupComponent } from '@app/manage/manage-cup/manage-cup.component';
import { RoleGuard } from '@app/manage/shared/role-guard.service';

const routes: Routes = [
   {
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['cup_editor', 'cup_match_editor'] },
      children: [
         {
            children: [
               { path: 'page/:number', component: CupStagesTableComponent, data: { roles: ['cup_editor'] } },
               { path: 'create', component: CupStageCreateComponent, data: { roles: ['cup_editor'] } },
               { path: ':id/edit', component: CupStageEditComponent, data: { roles: ['cup_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageCupStageComponent,
            data: { roles: ['cup_editor'] },
            path: 'stages'
         },
         {
            children: [
               { path: 'page/:pageNumber', component: CupMatchTableComponent, data: { roles: ['cup_match_editor'] } },
               { path: 'create', component: CupMatchCreateComponent, data: { roles: ['cup_match_editor'] } },
               { path: ':id/edit', component: CupMatchEditComponent, data: { roles: ['cup_match_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageCupMatchComponent,
            data: { roles: ['cup_match_editor'] },
            path: 'matches'
         },
         {
            children: [
               { path: 'page/:number', component: CupCupMatchesTableComponent, data: { roles: ['cup_editor'] } },
               { path: 'create', component: CupCupMatchCreateComponent, data: { roles: ['cup_editor'] } },
               { path: ':id/edit', component: CupCupMatchEditComponent, data: { roles: ['cup_editor'] } },
               { path: 'create-auto', component: CupCupMatchesCreateAutoComponent, data: { roles: ['cup_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageCupCupMatchComponent,
            data: { roles: ['cup_editor'] },
            path: 'cup-matches'
         },
         { path: '', pathMatch: 'full', redirectTo: 'matches' }
      ],
      component: ManageCupComponent,
      path: 'cup'
   }
];

@NgModule({
   exports: [RouterModule],
   imports: [RouterModule.forChild(routes)]
})
export class ManageCupRoutingModule {}
