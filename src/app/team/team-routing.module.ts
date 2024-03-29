import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard.service';
import { TeamCreateComponent } from '@team/team-create/team-create.component';
import { TeamEditComponent } from '@team/team-edit/team-edit.component';
import { TeamTeamMatchesComponent } from '@team/team-team-matches/team-team-matches.component';
import { TeamMyComponent } from '@team/team-my/team-my.component';
import { TeamParticipantsComponent } from '@team/team-participants/team-participants.component';
import { TeamPredictionsComponent } from '@team/team-predictions/team-predictions.component';
import { TeamRatingComponent } from '@team/team-rating/team-rating.component';
import { TeamResultsComponent } from '@team/team-results/team-results.component';
import { TeamRulesComponent } from '@team/team-rules/team-rules.component';
import { TeamComponent } from '@team/team.component';

const routes: Routes = [
   {
      path: '',
      component: TeamComponent,
      children: [
         {
            path: 'rules',
            component: TeamRulesComponent
         },
         {
            path: 'participants',
            component: TeamParticipantsComponent
         },
         {
            path: 'rating',
            component: TeamRatingComponent
         },
         {
            path: 'predictions',
            component: TeamPredictionsComponent
         },
         {
            path: 'team-matches',
            component: TeamTeamMatchesComponent
         },
         {
            path: 'results',
            component: TeamResultsComponent
         },
         {
            path: 'my',
            component: TeamMyComponent
         },
         {
            path: 'create',
            component: TeamCreateComponent,
            canActivate: [AuthGuard]
         },
         {
            path: ':id/edit',
            component: TeamEditComponent,
            canActivate: [AuthGuard]
         },
         {
            path: '',
            pathMatch: 'full',
            redirectTo: 'team-matches'
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TeamRoutingModule {}
