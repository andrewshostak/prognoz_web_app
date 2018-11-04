import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TeamCaptainComponent } from './team-captain/team-captain.component';
import { TeamCompetitionSelectComponent } from './team-competition-select/team-competition-select.component';
import { TeamComponent } from './team.component';
import { TeamEditModalComponent } from './shared/team-edit-modal/team-edit-modal.component';
import { TeamGoalkeeperFormComponent } from './shared/team-goalkeeper-form/team-goalkeeper-form.component';
import { TeamMatchesComponent } from './team-matches/team-matches.component';
import { TeamMyComponent } from './team-my/team-my.component';
import { TeamPredictionFormComponent } from './shared/team-prediction-form/team-prediction-form.component';
import { TeamPredictionsComponent } from './team-predictions/team-predictions.component';
import { TeamRatingComponent } from './team-rating/team-rating.component';
import { TeamRatingTableComponent } from './shared/team-rating-table/team-rating-table.component';
import { TeamRatingUserTableComponent } from './shared/team-rating-user-table/team-rating-user-table.component';
import { TeamResultsComponent } from './team-results/team-results.component';
import { TeamResultsTableComponent } from './shared/team-results-table/team-results-table.component';
import { TeamRoutingModule } from './team-routing.module';
import { TeamRulesComponent } from './team-rules/team-rules.component';
import { TeamSelectModalComponent } from './shared/team-select-modal/team-select-modal.component';
import { TeamSquadsComponent } from './team-squads/team-squads.component';
import { TeamTeamMatchCardComponent } from './shared/team-team-match-card/team-team-match-card.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, SimpleNotificationsModule, TeamRoutingModule],
    declarations: [
        TeamCaptainComponent,
        TeamCompetitionSelectComponent,
        TeamComponent,
        TeamEditModalComponent,
        TeamGoalkeeperFormComponent,
        TeamMatchesComponent,
        TeamMyComponent,
        TeamPredictionFormComponent,
        TeamPredictionsComponent,
        TeamRatingComponent,
        TeamRatingTableComponent,
        TeamRatingUserTableComponent,
        TeamResultsComponent,
        TeamResultsTableComponent,
        TeamRulesComponent,
        TeamSelectModalComponent,
        TeamSquadsComponent,
        TeamTeamMatchCardComponent
    ],
    exports: [TeamComponent]
})
export class TeamModule {}
