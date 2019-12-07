import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { CompetitionCreateComponent } from './competition-create/competition-create.component';
import { CompetitionEditComponent } from './competition-edit/competition-edit.component';
import { CompetitionTableComponent } from './competition-table/competition-table.component';
import { ManageCompetitionRoutingModule } from './manage-competition-routing.module';
import { ManageCompetitionComponent } from './manage-competition.component';
import { CompetitionFormComponent } from './shared/competition-form/competition-form.component';

@NgModule({
   imports: [CommonModule, ReactiveFormsModule, SharedModule, ManageCompetitionRoutingModule],
   declarations: [
      CompetitionCreateComponent,
      CompetitionEditComponent,
      CompetitionFormComponent,
      CompetitionTableComponent,
      ManageCompetitionComponent
   ]
})
export class ManageCompetitionModule {}
