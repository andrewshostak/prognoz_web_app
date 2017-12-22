import { CommonModule }                               from '@angular/common';
import { NgModule }                                   from '@angular/core';
import { ReactiveFormsModule }                        from '@angular/forms';
import { RouterModule }                               from '@angular/router';

import { ChartsModule }                               from 'ng2-charts';
import { ChampionshipLastResultsComponent }           from './championship/championship-last-results/championship-last-results.component';
import { ChampionshipMatchPredictableComponent }      from './championship/championship-match-predictable/championship-match-predictable.component';
import { ChampionshipMatchPredictionsTableComponent } from './championship/championship-match-predictions-table/championship-match-predictions-table.component';
import { ChampionshipNavigationComponent }            from './championship/championship-navigation/championship-navigation.component';
import { ChampionshipRatingTableComponent }           from './championship/championship-rating-table/championship-rating-table.component';
import { ChampionshipRatingTopComponent }             from './championship/championship-rating-top/championship-rating-top.component';
import { ChampionshipResultsTableComponent }          from './championship/championship-results-table/championship-results-table.component';
import { ChampionshipUserPredictionsTableComponent }  from './championship/championship-user-predictions-table/championship-user-predictions-table.component';
import { ConfirmModalComponent }                      from './confirm-modal/confirm-modal.component';
import { ErrorComponent }                             from './error/error.component';
import { InfoComponent }                              from './info/info.component';
import { LastUserComponent }                          from './last-user/last-user.component';
import { OnlineUsersListComponent }                   from './online-users-list/online-users-list.component';
import { SpinnerButtonComponent }                     from './spinner-button/spinner-button.component';
import { SpinnerComponent }                           from './spinner/spinner.component';
import { PaginationComponent }                        from './pagination/pagination.component';
import { SimpleNotificationsModule }                  from 'angular2-notifications';
import { TeamEditModalComponent }                     from './team/team-edit-modal/team-edit-modal.component';
import { TeamGoalkeeperFormComponent }                from './team/team-goalkeeper-form/team-goalkeeper-form.component';
import { TeamNavigationComponent }                    from './team/team-navigation/team-navigation.component';
import { TeamRatingTableComponent }                   from './team/team-rating-table/team-rating-table.component';
import { TeamRatingUserTableComponent }               from './team/team-rating-user-table/team-rating-user-table.component';
import { TeamResultsTableComponent }                  from './team/team-results-table/team-results-table.component';
import { TeamPredictionFormComponent }                from './team/team-prediction-form/team-prediction-form.component';
import { TeamRoundNavigationComponent }               from './team/team-round-navigation/team-round-navigation.component';
import { TeamSelectModalComponent }                   from './team/team-select-modal/team-select-modal.component';
import { TeamTeamMatchCardComponent }                 from './team/team-team-match-card/team-team-match-card.component';
import { TimePipe }                                   from './pipes/time.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ChartsModule,
        ReactiveFormsModule,
        SimpleNotificationsModule
    ],
    declarations: [
        ChampionshipRatingTopComponent,
        ChampionshipLastResultsComponent,
        ChampionshipRatingTableComponent,
        ChampionshipNavigationComponent,
        ChampionshipResultsTableComponent,
        ChampionshipMatchPredictionsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipMatchPredictableComponent,
        ConfirmModalComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        PaginationComponent,
        OnlineUsersListComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TeamEditModalComponent,
        TeamGoalkeeperFormComponent,
        TeamNavigationComponent,
        TeamPredictionFormComponent,
        TeamRatingTableComponent,
        TeamRatingUserTableComponent,
        TeamResultsTableComponent,
        TeamRoundNavigationComponent,
        TeamSelectModalComponent,
        TeamTeamMatchCardComponent,
        TimePipe,
    ],
    exports: [
        ChampionshipRatingTopComponent,
        ChampionshipLastResultsComponent,
        ChampionshipRatingTableComponent,
        ChampionshipNavigationComponent,
        ChampionshipResultsTableComponent,
        ChampionshipMatchPredictionsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipMatchPredictableComponent,
        ConfirmModalComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TeamEditModalComponent,
        TeamGoalkeeperFormComponent,
        TeamNavigationComponent,
        TeamPredictionFormComponent,
        TeamRatingTableComponent,
        TeamResultsTableComponent,
        TeamRatingUserTableComponent,
        TeamRoundNavigationComponent,
        TeamSelectModalComponent,
        TeamTeamMatchCardComponent,
        TimePipe
    ],
    providers: [
        TimePipe
    ]
})
export class SharedModule { }
