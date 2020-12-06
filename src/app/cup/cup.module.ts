import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';
import { CupApplicationsComponent } from './cup-applications/cup-applications.component';
import { CupCupMatchComponent } from './cup-cup-match/cup-cup-match.component';
import { CupCupMatchesComponent } from './cup-cup-matches/cup-cup-matches.component';
import { CupPredictionsComponent } from './cup-predictions/cup-predictions.component';
import { CupRatingGroupComponent } from './cup-rating-group/cup-rating-group.component';
import { CupRatingUserComponent } from './cup-rating-user/cup-rating-user.component';
import { CupRatingComponent } from './cup-rating/cup-rating.component';
import { CupRoutingModule } from './cup-routing.module';
import { CupRulesComponent } from './cup-rules/cup-rules.component';
import { CupComponent } from './cup.component';
import { CupApplicationModalComponent } from './shared/cup-application-modal/cup-application-modal.component';
import { CupCupMatchesDefaultComponent } from './shared/cup-cup-matches-default/cup-cup-matches-default.component';
import { CupCupMatchesGroupComponent } from './shared/cup-cup-matches-group/cup-cup-matches-group.component';
import { CupCupMatchesTwoRoundsComponent } from './shared/cup-cup-matches-two-rounds/cup-cup-matches-two-rounds.component';
import { CupPredictionFormComponent } from './shared/cup-prediction-form/cup-prediction-form.component';
import { CupRatingSeasonDetailsComponent } from './shared/cup-rating-season-details/cup-rating-season-details.component';
import { CupRatingSeasonsSummaryComponent } from './shared/cup-rating-seasons-summary/cup-rating-seasons-summary.component';
import { CupRatingTableComponent } from './shared/cup-rating-table/cup-rating-table.component';
import { CupStageSelectComponent } from './shared/cup-stage-select/cup-stage-select.component';

@NgModule({
   imports: [
      CommonModule,
      ChartsModule,
      CupRoutingModule,
      FormsModule,
      NgbModalModule,
      NgbTooltipModule,
      ReactiveFormsModule,
      SharedModule
   ],
   declarations: [
      CupComponent,
      CupApplicationModalComponent,
      CupApplicationsComponent,
      CupCupMatchesDefaultComponent,
      CupCupMatchesGroupComponent,
      CupCupMatchesTwoRoundsComponent,
      CupCupMatchesComponent,
      CupCupMatchComponent,
      CupPredictionFormComponent,
      CupPredictionsComponent,
      CupRatingComponent,
      CupRatingGroupComponent,
      CupRatingSeasonDetailsComponent,
      CupRatingSeasonsSummaryComponent,
      CupRatingTableComponent,
      CupRatingUserComponent,
      CupRulesComponent,
      CupStageSelectComponent
   ]
})
export class CupModule {}
