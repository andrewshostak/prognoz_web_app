import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@app/shared/shared.module';
import { NgbCollapseModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TeamAndParticipantsComponent } from '@team/shared/team-and-participants/team-and-participants.component';
import { TeamGoalkeeperFormComponent } from '@team/shared/team-goalkeeper-form/team-goalkeeper-form.component';
import { TeamGoalkeepersRatingComponent } from '@team/shared/team-goalkeepers-rating/team-goalkeepers-rating.component';
import { TeamPredictionFormComponent } from '@team/shared/team-prediction-form/team-prediction-form.component';
import { TeamRatingTableComponent } from '@team/shared/team-rating-table/team-rating-table.component';
import { TeamRatingUserComponent } from '@team/shared/team-rating-user/team-rating-user.component';
import { TeamResultsTableComponent } from '@team/shared/team-results-table/team-results-table.component';
import { TeamSelectModalComponent } from '@team/shared/team-select-modal/team-select-modal.component';
import { TeamStageSelectComponent } from '@team/shared/team-stage-select/team-stage-select.component';
import { TeamTeamMatchCardComponent } from '@team/shared/team-team-match-card/team-team-match-card.component';
import { TeamCaptainComponent } from '@team/team-captain/team-captain.component';
import { TeamCreateComponent } from '@team/team-create/team-create.component';
import { TeamEditComponent } from '@team/team-edit/team-edit.component';
import { TeamTeamMatchesNewComponent } from '@team/team-team-matches-new/team-team-matches-new.component';
import { TeamMyComponent } from '@team/team-my/team-my.component';
import { TeamParticipantsComponent } from '@team/team-participants/team-participants.component';
import { TeamPredictionsComponent } from '@team/team-predictions/team-predictions.component';
import { TeamRatingComponent } from '@team/team-rating/team-rating.component';
import { TeamResultsComponent } from '@team/team-results/team-results.component';
import { TeamRoutingModule } from '@team/team-routing.module';
import { TeamRulesComponent } from '@team/team-rules/team-rules.component';
import { TeamScorersRatingComponent } from '@team/shared/team-scorers-rating/team-scorers-rating.component';
import { TeamComponent } from '@team/team.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      SimpleNotificationsModule,
      TeamRoutingModule,
      NgbCollapseModule,
      NgbNavModule,
      NgSelectModule
   ],
   declarations: [
      TeamAndParticipantsComponent,
      TeamCaptainComponent,
      TeamComponent,
      TeamCreateComponent,
      TeamEditComponent,
      TeamGoalkeeperFormComponent,
      TeamGoalkeepersRatingComponent,
      TeamTeamMatchesNewComponent,
      TeamMyComponent,
      TeamParticipantsComponent,
      TeamPredictionFormComponent,
      TeamPredictionsComponent,
      TeamRatingComponent,
      TeamRatingTableComponent,
      TeamRatingUserComponent,
      TeamResultsComponent,
      TeamResultsTableComponent,
      TeamRulesComponent,
      TeamScorersRatingComponent,
      TeamSelectModalComponent,
      TeamTeamMatchCardComponent,
      TeamStageSelectComponent
   ],
   exports: [TeamComponent]
})
export class TeamModule {}
