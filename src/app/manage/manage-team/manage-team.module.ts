import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageTeamComponent } from './manage-team.component';
import { ManageTeamGuard } from './shared/manage-team-guard.service';
import { ManageTeamMatchModule } from './manage-team-match/manage-team-match.module';
import { ManageTeamParticipantModule } from './manage-team-participant/manage-team-participant.module';
import { ManageTeamRoutingModule } from './manage-team-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ManageTeamMatchModule,
        ManageTeamParticipantModule,
        ManageTeamRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [ManageTeamComponent],
    providers: [ManageTeamGuard]
})
export class ManageTeamModule {}
