import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CupCupMatchesComponent } from '@app/cup/cup-cup-matches/cup-cup-matches.component';
import { CupApplicationsComponent } from './cup-applications/cup-applications.component';
import { CupCupMatchComponent } from './cup-cup-match/cup-cup-match.component';
import { CupPredictionsComponent } from './cup-predictions/cup-predictions.component';
import { CupRatingGroupComponent } from './cup-rating-group/cup-rating-group.component';
import { CupRatingPositionInGroupsComponent } from './cup-rating-position-in-groups/cup-rating-position-in-groups.component';
import { CupRatingUserComponent } from './cup-rating-user/cup-rating-user.component';
import { CupRatingComponent } from './cup-rating/cup-rating.component';
import { CupRulesComponent } from './cup-rules/cup-rules.component';
import { CupComponent } from './cup.component';

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
         },
         {
            path: ':competitionId/rating-position-in-groups/:position',
            component: CupRatingPositionInGroupsComponent
         },
         {
            path: 'rules',
            component: CupRulesComponent
         },
         {
            path: '',
            pathMatch: 'full',
            redirectTo: 'cup-matches'
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class CupRoutingModule {}
