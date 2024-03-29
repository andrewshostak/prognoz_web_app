import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageTeamMatchModule } from '@app/manage/manage-team/manage-team-match/manage-team-match.module';
import { ManageTeamParticipantModule } from '@app/manage/manage-team/manage-team-participant/manage-team-participant.module';
import { ManageTeamRoutingModule } from '@app/manage/manage-team/manage-team-routing.module';
import { ManageTeamStageModule } from '@app/manage/manage-team/manage-team-stage/manage-team-stage.module';
import { ManageTeamTeamModule } from '@app/manage/manage-team/manage-team-team/manage-team-team.module';
import { ManageTeamComponent } from '@app/manage/manage-team/manage-team.component';
import { SharedModule } from '@app/shared/shared.module';
import { ManageTeamTeamMatchModule } from '@app/manage/manage-team/manage-team-team-match/manage-team-team-match.module';

@NgModule({
   declarations: [ManageTeamComponent],
   imports: [
      CommonModule,
      FormsModule,
      ManageTeamMatchModule,
      ManageTeamParticipantModule,
      ManageTeamRoutingModule,
      ManageTeamStageModule,
      ManageTeamTeamModule,
      ManageTeamTeamMatchModule,
      ReactiveFormsModule,
      SharedModule
   ]
})
export class ManageTeamModule {}
