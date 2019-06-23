import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChampionshipMatchCreateComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-create/championship-match-create.component';
import { ChampionshipMatchTableComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-table/championship-match-table.component';
import { ChampionshipMatchUpdateComponent } from '@app/manage/manage-championship/manage-championship-match/championship-match-update/championship-match-update.component';
import { ManageChampionshipMatchComponent } from '@app/manage/manage-championship/manage-championship-match/manage-championship-match.component';
import { ChampionshipMatchFormComponent } from '@app/manage/manage-championship/manage-championship-match/shared/championship-match-form/championship-match-form.component';
import { ManageChampionshipMatchGuard } from '@app/manage/manage-championship/manage-championship-match/shared/manage-championship-match-guard.service.service';
import { SharedModule } from '@app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
   declarations: [
      ChampionshipMatchTableComponent,
      ChampionshipMatchCreateComponent,
      ChampionshipMatchUpdateComponent,
      ChampionshipMatchFormComponent,
      ManageChampionshipMatchComponent
   ],
   imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule, SharedModule],
   providers: [ManageChampionshipMatchGuard]
})
export class ManageChampionshipMatchModule {}
