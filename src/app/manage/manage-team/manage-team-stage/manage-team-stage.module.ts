import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TeamStagesTableComponent } from '@app/manage/manage-team/manage-team-stage/team-stages-table/team-stages-table.component';
import { ManageTeamStageComponent } from '@app/manage/manage-team/manage-team-stage/manage-team-stage.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [ManageTeamStageComponent, TeamStagesTableComponent],
   imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule]
})
export class ManageTeamStageModule {}
