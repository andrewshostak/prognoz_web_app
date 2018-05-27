import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { CupApplicationsComponent } from './cup-applications/cup-applications.component';
import { CupComponent }             from './cup.component';
import { CupCupMatchComponent }     from './cup-cup-match/cup-cup-match.component';
import { CupCupMatchesComponent }   from './cup-cup-matches/cup-cup-matches.component';
import { CupPredictionsComponent }  from './cup-predictions/cup-predictions.component';
import { CupRatingComponent }       from './cup-rating/cup-rating.component';
import { CupRatingGroupComponent }  from './cup-rating-group/cup-rating-group.component';
import { CupRatingUserComponent }   from './cup-rating-user/cup-rating-user.component';

const routes: Routes = [
    {
        path: '',
        component: CupComponent,
        children: [
            {
                path: 'rating',
                component: CupRatingComponent
            },
            {
                path: 'rating/:userId',
                component: CupRatingUserComponent
            },
            {
                path: 'applications',
                component: CupApplicationsComponent
            },
            {
                path: 'cup-matches',
                component: CupCupMatchesComponent
            },
            {
                path: 'cup-matches/:cupCupMatchId',
                component: CupCupMatchComponent
            },
            {
                path: 'predictions',
                component: CupPredictionsComponent
            },
            {
                path: ':competitionId/rating-group/:groupNumber',
                component: CupRatingGroupComponent
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})

export class CupRoutingModule {}
