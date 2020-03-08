import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/core/guards/auth.guard.service';
import { TeamCompetitionSelectComponent } from '@team/team-competition-select/team-competition-select.component';
import { TeamCreateComponent } from '@team/team-create/team-create.component';
import { TeamEditComponent } from '@team/team-edit/team-edit.component';
import { TeamMatchesComponent } from '@team/team-matches/team-matches.component';
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
            path: 'competitions/:competitionId',
            component: TeamCompetitionSelectComponent,
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
                  path: 'matches/round/:round',
                  component: TeamMatchesComponent
               },
               {
                  path: 'matches',
                  component: TeamMatchesComponent
               },
               {
                  path: 'predictions/round/:round',
                  component: TeamPredictionsComponent
               },
               {
                  path: 'predictions',
                  component: TeamPredictionsComponent
               },
               {
                  path: 'my/round/:round',
                  component: TeamMyComponent
               },
               {
                  path: 'my',
                  component: TeamMyComponent
               },
               {
                  path: 'rating',
                  component: TeamRatingComponent
               },
               {
                  path: 'results/round/:round',
                  component: TeamResultsComponent
               },
               {
                  path: 'results',
                  component: TeamResultsComponent
               }
            ]
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
            path: 'competitions',
            pathMatch: 'full',
            redirectTo: 'competitions/get-active'
         },
         {
            path: '',
            pathMatch: 'full',
            redirectTo: 'competitions/get-active'
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TeamRoutingModule {}
