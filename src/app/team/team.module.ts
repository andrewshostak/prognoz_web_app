import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamEditModalComponent } from '@team/shared/team-edit-modal/team-edit-modal.component';
import { TeamGoalkeeperFormComponent } from '@team/shared/team-goalkeeper-form/team-goalkeeper-form.component';
import { TeamPredictionFormComponent } from '@team/shared/team-prediction-form/team-prediction-form.component';
import { TeamRatingTableComponent } from '@team/shared/team-rating-table/team-rating-table.component';
import { TeamRatingUserTableComponent } from '@team/shared/team-rating-user-table/team-rating-user-table.component';
import { TeamResultsTableComponent } from '@team/shared/team-results-table/team-results-table.component';
import { TeamSelectModalComponent } from '@team/shared/team-select-modal/team-select-modal.component';
import { TeamTeamMatchCardComponent } from '@team/shared/team-team-match-card/team-team-match-card.component';
import { TeamCaptainComponent } from '@team/team-captain/team-captain.component';
import { TeamCompetitionSelectComponent } from '@team/team-competition-select/team-competition-select.component';
import { TeamCreateComponent } from '@team/team-create/team-create.component';
import { TeamEditComponent } from '@team/team-edit/team-edit.component';
import { TeamMatchesComponent } from '@team/team-matches/team-matches.component';
import { TeamMyComponent } from '@team/team-my/team-my.component';
import { TeamPredictionsComponent } from '@team/team-predictions/team-predictions.component';
import { TeamRatingComponent } from '@team/team-rating/team-rating.component';
import { TeamResultsComponent } from '@team/team-results/team-results.component';
import { TeamRoutingModule } from '@team/team-routing.module';
import { TeamRulesComponent } from '@team/team-rules/team-rules.component';
import { TeamSquadsNewComponent } from '@team/team-squads-new/team-squads-new.component';
import { TeamSquadsComponent } from '@team/team-squads/team-squads.component';
import { TeamComponent } from '@team/team.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
   imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, SimpleNotificationsModule, TeamRoutingModule, NgbCollapseModule],
   declarations: [
      TeamCaptainComponent,
      TeamCompetitionSelectComponent,
      TeamComponent,
      TeamCreateComponent,
      TeamEditComponent,
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
      TeamSquadsNewComponent,
      TeamTeamMatchCardComponent
   ],
   exports: [TeamComponent]
})
export class TeamModule {}
