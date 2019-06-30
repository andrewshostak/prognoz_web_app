import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ManageTeamMatchComponent } from '@app/manage/manage-team/manage-team-match/manage-team-match.component';
import { ManageTeamMatchGuard } from '@app/manage/manage-team/manage-team-match/shared/manage-team-match-guard.service';
import { TeamMatchFormComponent } from '@app/manage/manage-team/manage-team-match/shared/team-match-form/team-match-form.component';
import { TeamMatchCreateComponent } from '@app/manage/manage-team/manage-team-match/team-match-create/team-match-create.component';
import { TeamMatchEditComponent } from '@app/manage/manage-team/manage-team-match/team-match-edit/team-match-edit.component';
import { TeamMatchesTableComponent } from '@app/manage/manage-team/manage-team-match/team-matches-table/team-matches-table.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [
      ManageTeamMatchComponent,
      TeamMatchesTableComponent,
      TeamMatchCreateComponent,
      TeamMatchEditComponent,
      TeamMatchFormComponent
   ],
   imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedModule],
   providers: [ManageTeamMatchGuard]
})
export class ManageTeamMatchModule {}
