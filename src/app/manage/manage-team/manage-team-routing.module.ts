import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageTeamComponent } from './manage-team.component';
import { ManageTeamGuard } from './shared/manage-team-guard.service';
import { ManageTeamParticipantComponent } from './manage-team-participant/manage-team-participant.component';
import { TeamMatchCreateComponent } from './team-match-create/team-match-create.component';
import { TeamMatchEditActiveComponent } from './team-match-edit-active/team-match-edit-active.component';
import { TeamMatchEditComponent } from './team-match-edit/team-match-edit.component';
import { TeamMatchEditEndedComponent } from './team-match-edit-ended/team-match-edit-ended.component';
import { TeamParticipantCreateComponent } from './manage-team-participant/team-participant-create/team-participant-create.component';
import { TeamParticipantEditComponent } from './manage-team-participant/team-participant-edit/team-participant-edit.component';
import { TeamParticipantsTableComponent } from './manage-team-participant/team-participants-table/team-participants-table.component';

const routes: Routes = [
    {
        path: 'team',
        component: ManageTeamComponent,
        canActivate: [ManageTeamGuard],
        children: [
            {
                path: 'participants',
                component: ManageTeamParticipantComponent,
                children: [
                    { path: 'page/:number', component: TeamParticipantsTableComponent },
                    { path: 'create', component: TeamParticipantCreateComponent },
                    { path: ':id/edit', component: TeamParticipantEditComponent },
                    { path: '', redirectTo: 'page/1', pathMatch: 'full' }
                ]
            },
            {
                path: '',
                canActivateChild: [ManageTeamGuard],
                children: [
                    { path: 'matches/create', component: TeamMatchCreateComponent },
                    { path: 'matches/edit/active', component: TeamMatchEditActiveComponent },
                    { path: 'matches/edit', component: TeamMatchEditComponent },
                    { path: 'matches/edit/ended', component: TeamMatchEditEndedComponent }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageTeamRoutingModule {}
