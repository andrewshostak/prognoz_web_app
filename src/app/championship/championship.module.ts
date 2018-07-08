import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChampionshipComponent } from './championship.component';
import { ChampionshipHomeComponent } from './championship-home/championship-home.component';
import { ChampionshipMatchComponent } from './championship-match/championship-match.component';
import { ChampionshipPredictionsComponent } from './championship-predictions/championship-predictions.component';
import { ChampionshipRatingComponent } from './championship-rating/championship-rating.component';
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
        ChampionshipPredictionsComponent,
        ChampionshipRatingComponent,
        ChampionshipResultsComponent,
        ChampionshipRulesComponent,
        ChampionshipUserComponent,
        ChampionshipMatchComponent,
        ChampionshipHomeComponent
    ],
    exports: [ChampionshipComponent]
})
export class ChampionshipModule {}
