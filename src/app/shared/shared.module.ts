import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChampionshipRatingTableComponent } from '@app/shared/components/championship/championship-rating-table/championship-rating-table.component';
import { ChampionshipResultsTableComponent } from '@app/shared/components/championship/championship-results-table/championship-results-table.component';
import { ChampionshipUserPredictionsTableComponent } from '@app/shared/components/championship/championship-user-predictions-table/championship-user-predictions-table.component';
import { ChampionshipUserRatingDetailsComponent } from '@app/shared/components/championship/championship-user-rating-details/championship-user-rating-details.component';
import { ConfirmationModalComponent } from '@app/shared/components/confirmation-modal/confirmation-modal.component';
import { DropdownNavigationComponent } from '@app/shared/components/dropdown-navigation/dropdown-navigation.component';
import { ErrorComponent } from '@app/shared/components/error/error.component';
import { InfoComponent } from '@app/shared/components/info/info.component';
import { LastCommentsComponent } from '@app/shared/components/last-comments/last-comments.component';
import { LastEndedMatchesComponent } from '@app/shared/components/last-ended-matches/last-ended-matches.component';
import { LastUserComponent } from '@app/shared/components/last-user/last-user.component';
import { MatchSelectComponent } from '@app/shared/components/match-select/match-select.component';
import { NavigationComponent } from '@app/shared/components/navigation/navigation.component';
import { OnlineUsersListComponent } from '@app/shared/components/online-users-list/online-users-list.component';
import { PaginationComponent } from '@app/shared/components/pagination/pagination.component';
import { SocialMedialLinksComponent } from '@app/shared/components/social-medial-links/social-medial-links.component';
import { SpinnerButtonComponent } from '@app/shared/components/spinner-button/spinner-button.component';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';
import { TeamFormComponent } from '@app/shared/components/team/team-form/team-form.component';
import { ClubLogoWithTooltipComponent } from '@app/shared/components/tooltips/club-logo-with-tooltip/club-logo-with-tooltip.component';
import { CustomContentWithTooltipComponent } from '@app/shared/components/tooltips/custom-content-with-tooltip/custom-content-with-tooltip.component';
import { PredictionWithTooltipComponent } from '@app/shared/components/tooltips/prediction-with-tooltip/prediction-with-tooltip.component';
import { TeamLogoWithTooltipComponent } from '@app/shared/components/tooltips/team-logo-with-tooltip/team-logo-with-tooltip.component';
import { UserLogoWithTooltipComponent } from '@app/shared/components/tooltips/user-logo-with-tooltip/user-logo-with-tooltip.component';
import { WinLogoWithTooltipComponent } from '@app/shared/components/tooltips/win-logo-with-tooltip/win-logo-with-tooltip.component';
import { TrueFalseIconsComponent } from '@app/shared/components/true-false-icons/true-false-icons.component';
import { UserMessageComponent } from '@app/shared/components/user-message/user-message.component';
import { UserSelectComponent } from '@app/shared/components/user-select/user-select.component';
import { TimePipe } from '@app/shared/pipes/time.pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';

@NgModule({
   declarations: [
      ChampionshipRatingTableComponent,
      ChampionshipResultsTableComponent,
      ChampionshipUserPredictionsTableComponent,
      ChampionshipUserRatingDetailsComponent,
      ClubLogoWithTooltipComponent,
      ConfirmationModalComponent,
      CustomContentWithTooltipComponent,
      DropdownNavigationComponent,
      ErrorComponent,
      InfoComponent,
      LastCommentsComponent,
      LastEndedMatchesComponent,
      LastUserComponent,
      MatchSelectComponent,
      NavigationComponent,
      OnlineUsersListComponent,
      PaginationComponent,
      PredictionWithTooltipComponent,
      SocialMedialLinksComponent,
      SpinnerComponent,
      SpinnerButtonComponent,
      TeamLogoWithTooltipComponent,
      TeamFormComponent,
      TimePipe,
      TrueFalseIconsComponent,
      UserLogoWithTooltipComponent,
      UserMessageComponent,
      UserSelectComponent,
      WinLogoWithTooltipComponent
   ],
   exports: [
      ChampionshipRatingTableComponent,
      ChampionshipResultsTableComponent,
      ChampionshipUserPredictionsTableComponent,
      ChampionshipUserRatingDetailsComponent,
      ClubLogoWithTooltipComponent,
      ConfirmationModalComponent,
      CustomContentWithTooltipComponent,
      DropdownNavigationComponent,
      ErrorComponent,
      InfoComponent,
      LastCommentsComponent,
      LastEndedMatchesComponent,
      LastUserComponent,
      MatchSelectComponent,
      NavigationComponent,
      OnlineUsersListComponent,
      PaginationComponent,
      PredictionWithTooltipComponent,
      SocialMedialLinksComponent,
      SpinnerComponent,
      SpinnerButtonComponent,
      TeamLogoWithTooltipComponent,
      TeamFormComponent,
      TimePipe,
      TrueFalseIconsComponent,
      UserLogoWithTooltipComponent,
      UserMessageComponent,
      UserSelectComponent,
      WinLogoWithTooltipComponent
   ],
   imports: [CommonModule, RouterModule, ChartsModule, ReactiveFormsModule, NgbTooltipModule, NgSelectModule],
   providers: [TimePipe]
})
export class SharedModule {}
