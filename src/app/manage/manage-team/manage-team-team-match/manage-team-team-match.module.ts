import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ManageTeamTeamMatchComponent } from '@app/manage/manage-team/manage-team-team-match/manage-team-team-match.component';
import { TeamTeamMatchesTableComponent } from '@app/manage/manage-team/manage-team-team-match/team-team-matches-table/team-team-matches-table.component';
import { TeamTeamMatchCreateComponent } from '@app/manage/manage-team/manage-team-team-match/team-team-match-create/team-team-match-create.component';
import { TeamTeamMatchEditComponent } from '@app/manage/manage-team/manage-team-team-match/team-team-match-edit/team-team-match-edit.component';
import { TeamTeamMatchGenerationModalComponent } from '@app/manage/manage-team/manage-team-team-match/team-team-match-generation-modal/team-team-match-generation-modal.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [
      ManageTeamTeamMatchComponent,
      TeamTeamMatchesTableComponent,
      TeamTeamMatchCreateComponent,
      TeamTeamMatchEditComponent,
      TeamTeamMatchGenerationModalComponent
   ],
   imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule]
})
export class ManageTeamTeamMatchModule {}
