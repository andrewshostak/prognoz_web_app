import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChampionshipComponent } from './championship.component';
import { ChampionshipHomeComponent } from './championship-home/championship-home.component';
import { ChampionshipMatchComponent } from './championship-match/championship-match.component';
import { ChampionshipPredictionsComponent } from './championship-predictions/championship-predictions.component';
import { ChampionshipRatingComponent } from './championship-rating/championship-rating.component';
import { ChampionshipResultsComponent } from './championship-results/championship-results.component';
import { ChampionshipRulesComponent } from './championship-rules/championship-rules.component';
import { ChampionshipUserComponent } from './championship-user/championship-user.component';
import { ChampionshipSeasonsComponent } from './championship-seasons/championship-seasons.component';
import { ChampionshipSeasonRatingComponent } from './championship-seasons/championship-season-rating/championship-season-rating.component';
import { ChampionshipCompetitionResultsComponent } from './championship-seasons/championship-competitions/championship-competition-results/championship-competition-results.component';
import { ChampionshipCompetitionWinnersComponent } from './championship-seasons/championship-competitions/championship-competition-winners/championship-competition-winners.component';
import { ChampionshipCompetitionRatingComponent } from './championship-seasons/championship-competitions/championship-competition-rating/championship-competition-rating.component';
import { ChampionshipCompetitionUserComponent } from './championship-seasons/championship-competitions/championship-competition-user/championship-competition-user.component';
import { ChampionshipCompetitionsComponent } from './championship-seasons/championship-competitions/championship-competitions.component';

const routes: Routes = [
    {
        path: 'championship',
        component: ChampionshipComponent,
        children: [
            {
                path: 'predicts',
                redirectTo: '/championship/predictions',
                pathMatch: 'full'
            },
            {
                path: 'predictions',
                component: ChampionshipPredictionsComponent
            },
            {
                path: 'rating',
                component: ChampionshipRatingComponent
            },
            {
                path: 'results',
                component: ChampionshipResultsComponent
            },
            {
                path: 'rules',
                component: ChampionshipRulesComponent
            },
            {
                path: 'users/:id',
                component: ChampionshipUserComponent
            },
            {
                path: 'matches/:id',
                component: ChampionshipMatchComponent
            },
            {
                path: 'home',
                component: ChampionshipHomeComponent
            },
            {
                path: 'seasons',
                component: ChampionshipSeasonsComponent,
                children: [
                    {
                        path: ':id/rating',
                        component: ChampionshipSeasonRatingComponent
                    },
                    {
                        path: ':id/competitions',
                        component: ChampionshipCompetitionsComponent,
                        children: [
                            {
                                path: ':competitionId/users/:userId',
                                component: ChampionshipCompetitionUserComponent
                            },
                            {
                                path: ':competitionId/rating',
                                component: ChampionshipCompetitionRatingComponent
                            },
                            {
                                path: ':competitionId/results',
                                component: ChampionshipCompetitionResultsComponent
                            },
                            {
                                path: ':competitionId/winners',
                                component: ChampionshipCompetitionWinnersComponent
                            },
                            {
                                path: ':competitionId',
                                redirectTo: ':competitionId/winners',
                                pathMatch: 'full'
                            }
                        ]
                    },
                    {
                        path: ':id',
                        redirectTo: ':id/competitions',
                        pathMatch: 'full'
                    }
                ]
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChampionshipRoutingModule {}
