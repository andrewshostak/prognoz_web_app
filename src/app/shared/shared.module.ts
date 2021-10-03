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
import { OnlineUsersListComponent } from '@app/shared/components/online-users-list/online-users-list.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { SocialMedialLinksComponent } from '@app/shared/components/social-medial-links/social-medial-links.component';
import { SpinnerButtonComponent } from '@app/shared/components/spinner-button/spinner-button.component';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';
import { TeamFormComponent } from '@app/shared/components/team/team-form/team-form.component';
import { TeamSelectComponent } from '@app/shared/components/team/team-select/team-select.component';
import { ClubLogoWithTooltipComponent } from '@app/shared/components/tooltips/club-logo-with-tooltip/club-logo-with-tooltip.component';
import { CustomContentWithTooltipComponent } from '@app/shared/components/tooltips/custom-content-with-tooltip/custom-content-with-tooltip.component';
import { PredictionWithTooltipComponent } from '@app/shared/components/tooltips/prediction-with-tooltip/prediction-with-tooltip.component';
import { TeamLogoWithTooltipComponent } from '@app/shared/components/tooltips/team-logo-with-tooltip/team-logo-with-tooltip.component';
import { UserLogoWithTooltipComponent } from '@app/shared/components/tooltips/user-logo-with-tooltip/user-logo-with-tooltip.component';
import { WinLogoWithTooltipComponent } from '@app/shared/components/tooltips/win-logo-with-tooltip/win-logo-with-tooltip.component';
import { TrueFalseIconsComponent } from '@app/shared/components/true-false-icons/true-false-icons.component';
import { UserSelectComponent } from '@app/shared/components/user-select/user-select.component';
import { TimePipe } from '@app/shared/pipes/time.pipe';
import { NgbDropdownModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { UserMessageNewComponent } from '@app/shared/components/user-message-new/user-message-new.component';
import { CompetitionSelectNewComponent } from '@app/shared/components/competition-select-new/competition-select-new.component';
import { HasPermissionsDirective } from '@app/shared/directives/has-permissions.directive';

@NgModule({
   declarations: [
      ChampionshipRatingTableComponent,
      ChampionshipResultsTableComponent,
      ChampionshipUserPredictionsTableComponent,
      ChampionshipUserRatingDetailsComponent,
      CheckboxComponent,
      ClubLogoWithTooltipComponent,
      ClubSelectComponent,
      CompetitionSelectNewComponent,
      ConfirmationModalComponent,
      CustomContentWithTooltipComponent,
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
      OnlineUsersListComponent,
      PaginationComponent,
      PredictionWithTooltipComponent,
      SocialMedialLinksComponent,
      SpinnerComponent,
      SpinnerButtonComponent,
      TeamLogoWithTooltipComponent,
      TeamFormComponent,
      TeamSelectComponent,
      TimePipe,
      TrueFalseIconsComponent,
      UserLogoWithTooltipComponent,
      UserMessageNewComponent,
      UserSelectComponent,
      WinLogoWithTooltipComponent,
      HasPermissionsDirective
   ],
   exports: [
      ChampionshipRatingTableComponent,
      ChampionshipResultsTableComponent,
      ChampionshipUserPredictionsTableComponent,
      ChampionshipUserRatingDetailsComponent,
      CheckboxComponent,
      ClubLogoWithTooltipComponent,
      ClubSelectComponent,
      CompetitionSelectNewComponent,
      ConfirmationModalComponent,
      CustomContentWithTooltipComponent,
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
      OnlineUsersListComponent,
      PaginationComponent,
      PredictionWithTooltipComponent,
      SocialMedialLinksComponent,
      SpinnerComponent,
      SpinnerButtonComponent,
      TeamLogoWithTooltipComponent,
      TeamFormComponent,
      TeamSelectComponent,
      TimePipe,
      TrueFalseIconsComponent,
      UserLogoWithTooltipComponent,
      UserMessageNewComponent,
      UserSelectComponent,
      WinLogoWithTooltipComponent,
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
