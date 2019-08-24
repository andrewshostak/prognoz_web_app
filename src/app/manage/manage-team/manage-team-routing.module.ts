import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageTeamMatchComponent } from '@app/manage/manage-team/manage-team-match/manage-team-match.component';
import { ManageTeamMatchGuard } from '@app/manage/manage-team/manage-team-match/shared/manage-team-match-guard.service';
import { TeamMatchCreateComponent } from '@app/manage/manage-team/manage-team-match/team-match-create/team-match-create.component';
import { TeamMatchEditComponent } from '@app/manage/manage-team/manage-team-match/team-match-edit/team-match-edit.component';
import { TeamMatchesTableComponent } from '@app/manage/manage-team/manage-team-match/team-matches-table/team-matches-table.component';
import { ManageTeamParticipantComponent } from '@app/manage/manage-team/manage-team-participant/manage-team-participant.component';
import { TeamParticipantCreateComponent } from '@app/manage/manage-team/manage-team-participant/team-participant-create/team-participant-create.component';
import { TeamParticipantEditComponent } from '@app/manage/manage-team/manage-team-participant/team-participant-edit/team-participant-edit.component';
import { TeamParticipantsTableComponent } from '@app/manage/manage-team/manage-team-participant/team-participants-table/team-participants-table.component';
import { ManageTeamTeamComponent } from '@app/manage/manage-team/manage-team-team/manage-team-team.component';
import { ManageTeamTeamGuard } from '@app/manage/manage-team/manage-team-team/shared/manage-team-team-guard.service';
import { TeamTeamsTableComponent } from '@app/manage/manage-team/manage-team-team/team-teams-table/team-teams-table.component';
import { ManageTeamComponent } from '@app/manage/manage-team/manage-team.component';
import { ManageTeamGuard } from '@app/manage/manage-team/shared/manage-team-guard.service';

const routes: Routes = [
   {
      canActivate: [ManageTeamGuard],
      canActivateChild: [ManageTeamGuard],
      children: [
         {
            canActivateChild: [ManageTeamMatchGuard],
            children: [
               { path: 'page/:number', component: TeamParticipantsTableComponent },
               { path: 'create', component: TeamParticipantCreateComponent },
               { path: ':id/edit', component: TeamParticipantEditComponent },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamParticipantComponent,
            path: 'participants'
         },
         {
            children: [
               { path: 'page/:pageNumber', component: TeamMatchesTableComponent },
               { path: 'create', component: TeamMatchCreateComponent },
               { path: ':id/edit', component: TeamMatchEditComponent },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamMatchComponent,
            path: 'matches'
         },
         {
            canActivateChild: [ManageTeamTeamGuard],
            children: [
               { path: 'page/:pageNumber', component: TeamTeamsTableComponent },
               { path: '', redirectTo: 'page/1', pathMatch: 'full' }
            ],
            component: ManageTeamTeamComponent,
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
