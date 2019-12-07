import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChampionshipMatchCreateComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-create/championship-match-create.component';
import { ChampionshipMatchEditComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-edit/championship-match-edit.component';
import { ChampionshipMatchTableComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-table/championship-match-table.component';
import { ManageChampionshipMatchComponent } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.component';
import { ChampionshipMatchFormComponent } from '@app/manage/manage-championship/manage-championship-match/shared/championship-match-form/championship-match-form.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
   declarations: [
      ChampionshipMatchTableComponent,
      ChampionshipMatchEditComponent,
      ChampionshipMatchCreateComponent,
      ChampionshipMatchFormComponent,
      ManageChampionshipMatchComponent
   ],
   imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule, SharedModule]
})
export class ManageChampionshipMatchModule {}
