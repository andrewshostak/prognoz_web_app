import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageTeamCompetitionsComponent } from '@app/manage/manage-team/manage-team-competitions/manage-team-competitions.component';
import { ManageTeamMatchModule } from '@app/manage/manage-team/manage-team-match/manage-team-match.module';
import { ManageTeamParticipantModule } from '@app/manage/manage-team/manage-team-participant/manage-team-participant.module';
import { ManageTeamRoutingModule } from '@app/manage/manage-team/manage-team-routing.module';
import { ManageTeamTeamModule } from '@app/manage/manage-team/manage-team-team/manage-team-team.module';
import { ManageTeamComponent } from '@app/manage/manage-team/manage-team.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [ManageTeamComponent, ManageTeamCompetitionsComponent],
   imports: [
      CommonModule,
      FormsModule,
      ManageTeamMatchModule,
      ManageTeamParticipantModule,
      ManageTeamRoutingModule,
      ManageTeamTeamModule,
      ReactiveFormsModule,
      SharedModule
   ]
})
export class ManageTeamModule {}
