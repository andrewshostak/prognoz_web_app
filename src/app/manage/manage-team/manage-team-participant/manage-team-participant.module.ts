import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ManageTeamParticipantComponent } from './manage-team-participant.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { TeamParticipantCreateComponent } from './team-participant-create/team-participant-create.component';
import { TeamParticipantEditComponent } from './team-participant-edit/team-participant-edit.component';
import { TeamParticipantFormComponent } from './shared/team-participant-form/team-participant-form.component';
import { TeamParticipantsTableComponent } from './team-participants-table/team-participants-table.component';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SharedModule],
    declarations: [
        ManageTeamParticipantComponent,
        TeamParticipantCreateComponent,
        TeamParticipantEditComponent,
        TeamParticipantFormComponent,
        TeamParticipantsTableComponent
    ]
})
export class ManageTeamParticipantModule {}
