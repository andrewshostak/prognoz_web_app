import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CupCupMatchesNewComponent } from '@app/cup/cup-cup-matches-new/cup-cup-matches-new.component';
import { CupApplicationsComponent } from './cup-applications/cup-applications.component';
import { CupCupMatchComponent } from './cup-cup-match/cup-cup-match.component';
import { CupCupMatchesComponent } from './cup-cup-matches/cup-cup-matches.component';
import { CupPredictionsComponent } from './cup-predictions/cup-predictions.component';
import { CupRatingGroupComponent } from './cup-rating-group/cup-rating-group.component';
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
            path: 'cup-matches-new',
            component: CupCupMatchesNewComponent
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
            path: 'rules',
            component: CupRulesComponent
         },
         {
            path: '',
            pathMatch: 'full',
            redirectTo: 'cup-matches;active=1'
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class CupRoutingModule {}
