import { NgModule }                 from '@angular/core';
import { CommonModule }             from '@angular/common';

import { CupComponent }             from './cup.component';
import { CupNavigationComponent }   from './shared/cup-navigation/cup-navigation.component';
import { CupRatingComponent }       from './cup-rating/cup-rating.component';
import { CupRatingTableComponent }  from './shared/cup-rating-table/cup-rating-table.component';
import { CupRatingService }         from './cup-rating/cup-rating.service';
import { CupRoutingModule }         from './cup-routing.module';
import { SharedModule }             from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        CupRoutingModule,
        SharedModule
    ],
    declarations: [
        CupComponent,
        CupNavigationComponent,
        CupRatingComponent,
        CupRatingTableComponent,
    ],
    providers: [
        CupRatingService
    ]
})
export class CupModule { }
