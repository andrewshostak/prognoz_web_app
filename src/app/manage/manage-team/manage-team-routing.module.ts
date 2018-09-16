import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManageTeamComponent } from './manage-team.component';
import { ManageTeamGuard } from './shared/manage-team-guard.service';
import { ManageTeamMatchComponent } from './manage-team-match/manage-team-match.component';
import { ManageTeamParticipantComponent } from './manage-team-participant/manage-team-participant.component';
import { TeamMatchesTableComponent } from './manage-team-match/team-matches-table/team-matches-table.component';
import { TeamParticipantCreateComponent } from './manage-team-participant/team-participant-create/team-participant-create.component';
import { TeamParticipantEditComponent } from './manage-team-participant/team-participant-edit/team-participant-edit.component';
import { TeamParticipantsTableComponent } from './manage-team-participant/team-participants-table/team-participants-table.component';
import { TeamMatchCreateComponent } from './manage-team-match/team-match-create/team-match-create.component';
import { TeamMatchEditComponent } from './manage-team-match/team-match-edit/team-match-edit.component';

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
                path: 'matches',
                component: ManageTeamMatchComponent,
                children: [
                    { path: 'page/:number', component: TeamMatchesTableComponent },
                    { path: 'create', component: TeamMatchCreateComponent },
                    { path: ':id/edit', component: TeamMatchEditComponent },
                    { path: '', redirectTo: 'page/1', pathMatch: 'full' }
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
