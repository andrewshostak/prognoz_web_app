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
import { PermissionGuard } from '@app/manage/shared/permission-guard.service';

const routes: Routes = [
   {
      children: [
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_cup_stage', 'update_cup_stage', 'delete_cup_stage'] },
            children: [
               { path: 'page/:number', component: CupStagesTableComponent },
               {
                  path: 'create',
                  component: CupStageCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_cup_stage'] }
               },
               {
                  path: ':id',
                  component: CupStageEditComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['update_cup_stage'] }
               },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageCupStageComponent,
            path: 'stages'
         },
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_cup_match', 'update_cup_match', 'delete_cup_match'] },
            children: [
               { path: 'page/:pageNumber', component: CupMatchTableComponent },
               {
                  path: 'create',
                  component: CupMatchCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_cup_match'] }
               },
               {
                  path: ':id/edit',
                  component: CupMatchEditComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['update_cup_match'] }
               },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageCupMatchComponent,
            path: 'matches'
         },
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_cup_cup_match', 'update_cup_cup_match', 'delete_cup_cup_match'] },
            children: [
               { path: 'page/:number', component: CupCupMatchesTableComponent },
               {
                  path: 'create',
                  component: CupCupMatchCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_cup_cup_match'] }
               },
               {
                  path: ':id/edit',
                  component: CupCupMatchEditComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['update_cup_cup_match'] }
               },
               {
                  path: 'create-auto',
                  component: CupCupMatchesCreateAutoComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_cup_cup_match'] }
               },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageCupCupMatchComponent,
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
