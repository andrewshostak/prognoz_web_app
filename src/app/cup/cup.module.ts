import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { ReactiveFormsModule }              from '@angular/forms';

import { ChartsModule }                     from 'ng2-charts';
import { CupAddApplicationModalComponent }  from './shared/cup-add-application-modal/cup-add-application-modal.component';
import { CupApplicationsComponent }         from './cup-applications/cup-applications.component';
import { CupApplicationService }            from './cup-applications/cup-application.service';
import { CupComponent }                     from './cup.component';
import { CupCupMatchComponent }             from './cup-cup-match/cup-cup-match.component';
import { CupCupMatchesComponent }           from './cup-cup-matches/cup-cup-matches.component';
import { CupNavigationComponent }           from './shared/cup-navigation/cup-navigation.component';
import { CupPredictionFormComponent }       from './shared/cup-prediction-form/cup-prediction-form.component';
import { CupPredictionsComponent }          from './cup-predictions/cup-predictions.component';
import { CupRatingComponent }               from './cup-rating/cup-rating.component';
import { CupRatingGroupComponent }          from './cup-rating-group/cup-rating-group.component';
import { CupRatingService }                 from './cup-rating/cup-rating.service';
import { CupRatingSeasonDetailsComponent }  from './shared/cup-rating-season-details/cup-rating-season-details.component';
import { CupRatingSeasonsSummaryComponent } from './shared/cup-rating-seasons-summary/cup-rating-seasons-summary.component';
import { CupRatingTableComponent }          from './shared/cup-rating-table/cup-rating-table.component';
import { CupRatingUserComponent }           from './cup-rating-user/cup-rating-user.component';
import { CupRoutingModule }                 from './cup-routing.module';
import { SharedModule }                     from '../shared/shared.module';
import { CupRulesComponent }                from './cup-rules/cup-rules.component';

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        CupRoutingModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        CupComponent,
        CupAddApplicationModalComponent,
        CupApplicationsComponent,
        CupCupMatchesComponent,
        CupCupMatchComponent,
        CupNavigationComponent,
        CupPredictionFormComponent,
        CupPredictionsComponent,
        CupRatingComponent,
        CupRatingGroupComponent,
        CupRatingSeasonDetailsComponent,
        CupRatingSeasonsSummaryComponent,
        CupRatingTableComponent,
        CupRatingUserComponent,
        CupRulesComponent,
    ],
    providers: [
        CupApplicationService,
        CupRatingService
    ]
})
export class CupModule { }