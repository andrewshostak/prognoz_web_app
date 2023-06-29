import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChampionshipRatingTableComponent } from '@app/shared/components/championship/championship-rating-table/championship-rating-table.component';
import { ChampionshipResultsTableComponent } from '@app/shared/components/championship/championship-results-table/championship-results-table.component';
import { ChampionshipUserPredictionsTableComponent } from '@app/shared/components/championship/championship-user-predictions-table/championship-user-predictions-table.component';
import { ChampionshipUserRatingDetailsComponent } from '@app/shared/components/championship/championship-user-rating-details/championship-user-rating-details.component';
import { CheckboxComponent } from '@app/shared/components/checkbox/checkbox.component';
import { ClubSelectComponent } from '@app/shared/components/club-select/club-select.component';
import { ConfirmationModalComponent } from '@app/shared/components/confirmation-modal/confirmation-modal.component';
import { DeclensionPipe } from '@app/shared/pipes/declension.pipe';
import { DropdownNavigationComponent } from '@app/shared/components/dropdown-navigation/dropdown-navigation.component';
import { ErrorComponent } from '@app/shared/components/error/error.component';
import { FileUploadComponent } from '@app/shared/components/file-upload/file-upload.component';
import { InfoComponent } from '@app/shared/components/info/info.component';
import { LastCommentsComponent } from '@app/shared/components/last-comments/last-comments.component';
import { LastEndedMatchesComponent } from '@app/shared/components/last-ended-matches/last-ended-matches.component';
import { LastUserComponent } from '@app/shared/components/last-user/last-user.component';
import { MatchSelectComponent } from '@app/shared/components/match-select/match-select.component';
import { MessageInputComponent } from '@app/shared/components/message-input/message-input.component';
import { NavigationComponent } from '@app/shared/components/navigation/navigation.component';
import { NewsLogoComponent } from '@app/shared/components/tooltips/news-logo/news-logo.component';
import { OnlineUsersListComponent } from '@app/shared/components/online-users-list/online-users-list.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { SocialMedialLinksComponent } from '@app/shared/components/social-medial-links/social-medial-links.component';
import { SpinnerButtonComponent } from '@app/shared/components/spinner-button/spinner-button.component';
import { SortKeyValuePipe } from '@app/shared/pipes/sort-key-value.pipe';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';
import { TeamFormComponent } from '@app/shared/components/team/team-form/team-form.component';
import { TeamSelectComponent } from '@app/shared/components/team/team-select/team-select.component';
import { ClubLogoComponent } from '@app/shared/components/tooltips/club-logo/club-logo.component';
import { CustomContentWithTooltipComponent } from '@app/shared/components/tooltips/custom-content-with-tooltip/custom-content-with-tooltip.component';
import { PredictionWithTooltipComponent } from '@app/shared/components/tooltips/prediction-with-tooltip/prediction-with-tooltip.component';
import { TeamLogoComponent } from '@app/shared/components/tooltips/team-logo/team-logo.component';
import { UserLogoComponent } from '@app/shared/components/tooltips/user-logo/user-logo.component';
import { TrueFalseIconsComponent } from '@app/shared/components/true-false-icons/true-false-icons.component';
import { UserSelectComponent } from '@app/shared/components/user-select/user-select.component';
import { TimePipe } from '@app/shared/pipes/time.pipe';
import { NgbDropdownModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { UserMessageComponent } from '@app/shared/components/user-message/user-message.component';
import { CompetitionSelectComponent } from '@app/shared/components/competition-select/competition-select.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions.directive';
import { UserWinsAwardsComponent } from '@app/shared/components/user-wins-awards/user-wins-awards.component';

@NgModule({
   declarations: [
      ChampionshipRatingTableComponent,
      ChampionshipResultsTableComponent,
      ChampionshipUserPredictionsTableComponent,
      ChampionshipUserRatingDetailsComponent,
      CheckboxComponent,
      ClubLogoComponent,
      ClubSelectComponent,
      CompetitionSelectComponent,
      ConfirmationModalComponent,
      CustomContentWithTooltipComponent,
      DeclensionPipe,
      DropdownNavigationComponent,
      ErrorComponent,
      FileUploadComponent,
      InfoComponent,
      LastCommentsComponent,
      LastEndedMatchesComponent,
      LastUserComponent,
      MatchSelectComponent,
      MessageInputComponent,
      NavigationComponent,
      NewsLogoComponent,
      OnlineUsersListComponent,
      PaginationComponent,
      PredictionWithTooltipComponent,
      SocialMedialLinksComponent,
      SortKeyValuePipe,
      SpinnerComponent,
      SpinnerButtonComponent,
      TeamLogoComponent,
      TeamFormComponent,
      TeamSelectComponent,
      TimePipe,
      TrueFalseIconsComponent,
      UserLogoComponent,
      UserMessageComponent,
      UserSelectComponent,
      UserWinsAwardsComponent,
      HasPermissionsDirective
   ],
   exports: [
      ChampionshipRatingTableComponent,
      ChampionshipResultsTableComponent,
      ChampionshipUserPredictionsTableComponent,
      ChampionshipUserRatingDetailsComponent,
      CheckboxComponent,
      ClubLogoComponent,
      ClubSelectComponent,
      CompetitionSelectComponent,
      ConfirmationModalComponent,
      CustomContentWithTooltipComponent,
      DeclensionPipe,
      DropdownNavigationComponent,
      ErrorComponent,
      FileUploadComponent,
      InfoComponent,
      LastCommentsComponent,
      LastEndedMatchesComponent,
      LastUserComponent,
      MatchSelectComponent,
      MessageInputComponent,
      NavigationComponent,
      NewsLogoComponent,
      OnlineUsersListComponent,
      PaginationComponent,
      PredictionWithTooltipComponent,
      SocialMedialLinksComponent,
      SortKeyValuePipe,
      SpinnerComponent,
      SpinnerButtonComponent,
      TeamLogoComponent,
      TeamFormComponent,
      TeamSelectComponent,
      TimePipe,
      TrueFalseIconsComponent,
      UserLogoComponent,
      UserMessageComponent,
      UserSelectComponent,
      UserWinsAwardsComponent,
      HasPermissionsDirective
   ],
   imports: [
      CommonModule,
      RouterModule,
      ChartsModule,
      ReactiveFormsModule,
      NgbTooltipModule,
      NgbPopoverModule,
      NgSelectModule,
      FormsModule,
      NgbDropdownModule
   ],
   providers: [TimePipe]
})
export class SharedModule {}
