import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { RoleGuard } from '@app/manage/shared/role-guard.service';

const routes: Routes = [
   {
      canActivate: [RoleGuard],
      canActivateChild: [RoleGuard],
      data: { roles: ['team_editor', 'team_match_editor'] },
      children: [
         {
            children: [
               { path: 'page/:number', component: TeamParticipantsTableComponent, data: { roles: ['team_editor'] } },
               { path: 'create', component: TeamParticipantCreateComponent, data: { roles: ['team_editor'] } },
               { path: ':id/edit', component: TeamParticipantEditComponent, data: { roles: ['team_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamParticipantComponent,
            data: { roles: ['team_editor'] },
            path: 'participants'
         },
         {
            children: [
               { path: 'page/:pageNumber', component: TeamMatchesTableComponent, data: { roles: ['team_match_editor'] } },
               { path: 'create', component: TeamMatchCreateComponent, data: { roles: ['team_match_editor'] } },
               { path: ':id/edit', component: TeamMatchEditComponent, data: { roles: ['team_match_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamMatchComponent,
            data: { roles: ['team_match_editor'] },
            path: 'matches'
         },
         {
            children: [
               { path: 'page/:pageNumber', component: TeamTeamsTableComponent, data: { roles: ['team_editor'] } },
               { path: 'create', component: TeamCreateComponent, data: { roles: ['team_editor'] } },
               { path: ':id/edit', component: TeamEditComponent, data: { roles: ['team_editor'] } },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamTeamComponent,
            data: { roles: ['team_editor'] },
            path: 'teams'
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
