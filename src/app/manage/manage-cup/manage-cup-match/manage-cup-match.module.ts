import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CupMatchCreateComponent } from '@app/manage/manage-cup/manage-cup-match/cup-match-create/cup-match-create.component';
import { CupMatchEditComponent } from '@app/manage/manage-cup/manage-cup-match/cup-match-edit/cup-match-edit.component';
import { CupMatchTableComponent } from '@app/manage/manage-cup/manage-cup-match/cup-match-table/cup-match-table.component';
import { ManageCupMatchComponent } from '@app/manage/manage-cup/manage-cup-match/manage-cup-match.component';
import { CupMatchFormComponent } from '@app/manage/manage-cup/manage-cup-match/shared/cup-match-form/cup-match-form.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
   declarations: [ManageCupMatchComponent, CupMatchCreateComponent, CupMatchEditComponent, CupMatchFormComponent, CupMatchTableComponent],
   imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SharedModule]
})
export class ManageCupMatchModule {}
