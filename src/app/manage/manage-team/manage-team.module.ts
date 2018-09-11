import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageTeamComponent } from './manage-team.component';
import { ManageTeamGuard } from './shared/manage-team-guard.service';
import { ManageTeamParticipantModule } from './manage-team-participant/manage-team-participant.module';
import { ManageTeamRoutingModule } from './manage-team-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TeamMatchCreateComponent } from './team-match-create/team-match-create.component';
import { TeamMatchEditActiveComponent } from './team-match-edit-active/team-match-edit-active.component';
import { TeamMatchEditComponent } from './team-match-edit/team-match-edit.component';
import { TeamMatchEditEndedComponent } from './team-match-edit-ended/team-match-edit-ended.component';

@NgModule({
    imports: [CommonModule, FormsModule, ManageTeamParticipantModule, ManageTeamRoutingModule, ReactiveFormsModule, SharedModule],
    declarations: [
        ManageTeamComponent,
        TeamMatchCreateComponent,
        TeamMatchEditActiveComponent,
        TeamMatchEditComponent,
        TeamMatchEditEndedComponent
    ],
    providers: [ManageTeamGuard]
})
export class ManageTeamModule {}
