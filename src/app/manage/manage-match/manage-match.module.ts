import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManageMatchRoutingModule } from '@app/manage/manage-match/manage-match-routing.module';
import { ManageMatchComponent } from '@app/manage/manage-match/manage-match.component';
import { MatchCreateComponent } from '@app/manage/manage-match/match-create/match-create.component';
import { MatchEditComponent } from '@app/manage/manage-match/match-edit/match-edit.component';
import { MatchTableComponent } from '@app/manage/manage-match/match-table/match-table.component';
import { ManageMatchGuard } from '@app/manage/manage-match/shared/manage-match-guard.service';
import { MatchFormComponent } from '@app/manage/manage-match/shared/match-form/match-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
   declarations: [ManageMatchComponent, MatchTableComponent, MatchCreateComponent, MatchFormComponent, MatchEditComponent],
   imports: [CommonModule, ReactiveFormsModule, NgSelectModule, FormsModule, SharedModule, ManageMatchRoutingModule],
   providers: [ManageMatchGuard]
})
export class ManageMatchModule {}
