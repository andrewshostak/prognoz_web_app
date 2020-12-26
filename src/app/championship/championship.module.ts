import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';
import { ChampionshipComponent } from './championship.component';
import { ChampionshipHomeComponent } from './championship-home/championship-home.component';
import { ChampionshipMatchComponent } from './championship-match/championship-match.component';
import { ChampionshipMatchPredictableComponent } from './shared/championship-match-predictable/championship-match-predictable.component';
import { ChampionshipMatchPredictionsTableComponent } from './shared/championship-match-predictions-table/championship-match-predictions-table.component';
import { ChampionshipPredictionsComponent } from './championship-predictions/championship-predictions.component';
import { ChampionshipRatingComponent } from './championship-rating/championship-rating.component';
import { ChampionshipRatingTopComponent } from './shared/championship-rating-top/championship-rating-top.component';
import { ChampionshipResultsComponent } from './championship-results/championship-results.component';
import { ChampionshipRoutingModule } from './championship-routing.module';
import { ChampionshipRulesComponent } from './championship-rules/championship-rules.component';
import { ChampionshipSeasonsModule } from './championship-seasons/championship-seasons.module';
import { ChampionshipUserComponent } from './championship-user/championship-user.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
   imports: [CommonModule, ReactiveFormsModule, ChampionshipRoutingModule, SharedModule, ChartsModule, ChampionshipSeasonsModule],
   declarations: [
      ChampionshipComponent,
      ChampionshipHomeComponent,
      ChampionshipMatchComponent,
      ChampionshipMatchPredictableComponent,
      ChampionshipMatchPredictionsTableComponent,
      ChampionshipPredictionsComponent,
      ChampionshipRatingComponent,
      ChampionshipRatingTopComponent,
      ChampionshipResultsComponent,
      ChampionshipRulesComponent,
      ChampionshipUserComponent
   ],
   exports: [ChampionshipComponent]
})
export class ChampionshipModule {}
