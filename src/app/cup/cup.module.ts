import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';

import { ChartsModule }                     from 'ng2-charts';
import { CupComponent }                     from './cup.component';
import { CupNavigationComponent }           from './shared/cup-navigation/cup-navigation.component';
import { CupRatingComponent }               from './cup-rating/cup-rating.component';
import { CupRatingService }                 from './cup-rating/cup-rating.service';
import { CupRatingSeasonDetailsComponent }  from './shared/cup-rating-season-details/cup-rating-season-details.component';
import { CupRatingSeasonsSummaryComponent } from './shared/cup-rating-seasons-summary/cup-rating-seasons-summary.component';
import { CupRatingTableComponent }          from './shared/cup-rating-table/cup-rating-table.component';
import { CupRatingUserComponent }           from './cup-rating-user/cup-rating-user.component';
import { CupRoutingModule }                 from './cup-routing.module';
import { SharedModule }                     from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ChartsModule,
        CupRoutingModule,
        SharedModule
    ],
    declarations: [
        CupComponent,
        CupNavigationComponent,
        CupRatingComponent,
        CupRatingSeasonDetailsComponent,
        CupRatingSeasonsSummaryComponent,
        CupRatingTableComponent,
        CupRatingUserComponent,
    ],
    providers: [
        CupRatingService
    ]
})
export class CupModule { }
