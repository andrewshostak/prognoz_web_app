import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageTeamCompetitionsComponent } from '@app/manage/manage-team/manage-team-competitions/manage-team-competitions.component';
import { ManageTeamMatchComponent } from '@app/manage/manage-team/manage-team-match/manage-team-match.component';
import { TeamMatchCreateComponent } from '@app/manage/manage-team/manage-team-match/team-match-create/team-match-create.component';
import { TeamMatchEditComponent } from '@app/manage/manage-team/manage-team-match/team-match-edit/team-match-edit.component';
import { TeamMatchesTableComponent } from '@app/manage/manage-team/manage-team-match/team-matches-table/team-matches-table.component';
import { ManageTeamParticipantComponent } from '@app/manage/manage-team/manage-team-participant/manage-team-participant.component';
import { TeamParticipantCreateComponent } from '@app/manage/manage-team/manage-team-participant/team-participant-create/team-participant-create.component';
import { TeamParticipantEditComponent } from '@app/manage/manage-team/manage-team-participant/team-participant-edit/team-participant-edit.component';
import { TeamParticipantsTableComponent } from '@app/manage/manage-team/manage-team-participant/team-participants-table/team-participants-table.component';
import { ManageTeamTeamComponent } from '@app/manage/manage-team/manage-team-team/manage-team-team.component';
import { TeamCreateComponent } from '@app/manage/manage-team/manage-team-team/team-create/team-create.component';
import { TeamEditComponent } from '@app/manage/manage-team/manage-team-team/team-edit/team-edit.component';
import { TeamTeamsTableComponent } from '@app/manage/manage-team/manage-team-team/team-teams-table/team-teams-table.component';
import { ManageTeamComponent } from '@app/manage/manage-team/manage-team.component';
import { PermissionGuard } from '@app/manage/shared/permission-guard.service';
import { TeamStagesTableComponent } from '@app/manage/manage-team/manage-team-stage/team-stages-table/team-stages-table.component';
import { ManageTeamStageComponent } from '@app/manage/manage-team/manage-team-stage/manage-team-stage.component';
import { TeamStageCreateComponent } from '@app/manage/manage-team/manage-team-stage/team-stage-create/team-stage-create.component';

const routes: Routes = [
   {
      children: [
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['update_competition'] },
            component: ManageTeamCompetitionsComponent,
            path: 'competitions'
         },
         {
            canActivate: [PermissionGuard],
            data: {
               permissions: ['create_team_participant_wo_validation', 'update_team_participant_wo_validation', 'delete_team_wo_validation']
            },
            children: [
               { path: 'page/:number', component: TeamParticipantsTableComponent },
               {
                  path: 'create',
                  component: TeamParticipantCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_team_participant_wo_validation'] }
               },
               {
                  path: ':id/edit',
                  component: TeamParticipantEditComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['update_team_participant_wo_validation'] }
               },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamParticipantComponent,
            path: 'participants'
         },
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_team_match', 'update_team_match', 'delete_team_match'] },
            children: [
               { path: 'page/:pageNumber', component: TeamMatchesTableComponent },
               { path: 'create', component: TeamMatchCreateComponent, data: { permissions: ['create_team_match'] } },
               { path: ':id/edit', component: TeamMatchEditComponent, data: { permissions: ['update_team_match'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamMatchComponent,
            path: 'matches'
         },
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_team_wo_validation', 'update_team_wo_validation', 'delete_team_wo_validation'] },
            children: [
               { path: 'page/:pageNumber', component: TeamTeamsTableComponent },
               {
                  path: 'create',
                  component: TeamCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_team_wo_validation'] }
               },
               {
                  path: ':id/edit',
                  component: TeamEditComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['update_team_wo_validation'] }
               },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamTeamComponent,
            path: 'teams'
         },
         {
            canActivate: [PermissionGuard],
            data: { permissions: ['create_team_stage', 'update_team_stage', 'delete_team_stage'] },
            children: [
               { path: 'page/:pageNumber', component: TeamStagesTableComponent },
               {
                  path: 'create',
                  component: TeamStageCreateComponent,
                  canActivate: [PermissionGuard],
                  data: { permissions: ['create_team_stage'] }
               },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamStageComponent,
            path: 'stages'
         },
         { path: '', pathMatch: 'full', redirectTo: 'matches' }
      ],
      component: ManageTeamComponent,
      path: 'team'
   }
];

@NgModule({
   exports: [RouterModule],
   imports: [RouterModule.forChild(routes)]
})
export class ManageTeamRoutingModule {}
