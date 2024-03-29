import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TeamStagesTableComponent } from '@app/manage/manage-team/manage-team-stage/team-stages-table/team-stages-table.component';
import { ManageTeamStageComponent } from '@app/manage/manage-team/manage-team-stage/manage-team-stage.component';
import { TeamStageCreateComponent } from '@app/manage/manage-team/manage-team-stage/team-stage-create/team-stage-create.component';
import { TeamStagesGenerationModalComponent } from '@app/manage/manage-team/manage-team-stage/team-stages-generation-modal/team-stages-generation-modal.component';
import { TeamStageEditComponent } from '@app/manage/manage-team/manage-team-stage/team-stage-edit/team-stage-edit.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [
      ManageTeamStageComponent,
      TeamStagesTableComponent,
      TeamStageCreateComponent,
      TeamStageEditComponent,
      TeamStagesGenerationModalComponent
   ],
   imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule]
})
export class ManageTeamStageModule {}
