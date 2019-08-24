import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageTeamMatchModule } from '@app/manage/manage-team/manage-team-match/manage-team-match.module';
import { ManageTeamParticipantModule } from '@app/manage/manage-team/manage-team-participant/manage-team-participant.module';
import { ManageTeamRoutingModule } from '@app/manage/manage-team/manage-team-routing.module';
import { ManageTeamTeamModule } from '@app/manage/manage-team/manage-team-team/manage-team-team.module';
import { ManageTeamComponent } from '@app/manage/manage-team/manage-team.component';
import { ManageTeamGuard } from '@app/manage/manage-team/shared/manage-team-guard.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [ManageTeamComponent],
   imports: [
      CommonModule,
      FormsModule,
      ManageTeamMatchModule,
      ManageTeamParticipantModule,
      ManageTeamRoutingModule,
      ManageTeamTeamModule,
      ReactiveFormsModule,
      SharedModule
   ],
   providers: [ManageTeamGuard]
})
export class ManageTeamModule {}
