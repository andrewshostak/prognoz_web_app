import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChampionshipLastResultsComponent } from './components/championship/championship-last-results/championship-last-results.component';
import { ChampionshipRatingTableComponent } from './components/championship/championship-rating-table/championship-rating-table.component';
import { ChampionshipResultsTableComponent } from './components/championship/championship-results-table/championship-results-table.component';
import { ChampionshipUserRatingDetailsComponent } from './components/championship/championship-user-rating-details/championship-user-rating-details.component';
import { ChampionshipUserPredictionsTableComponent } from './components/championship/championship-user-predictions-table/championship-user-predictions-table.component';
import { ChartsModule } from 'ng2-charts';
import { ClubLogoWithTooltipComponent } from './components/tooltips/club-logo-with-tooltip/club-logo-with-tooltip.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ConfirmModalNewComponent } from './components/confirm-modal-new/confirm-modal-new.component';
import { DropdownNavigationComponent } from './components/dropdown-navigation/dropdown-navigation.component';
import { ErrorComponent } from './components/error/error.component';
import { InfoComponent } from './components/info/info.component';
import { LastCommentsComponent } from './components/last-comments/last-comments.component';
import { LastUserComponent } from './components/last-user/last-user.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { OnlineUsersListComponent } from './components/online-users-list/online-users-list.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SocialMedialLinksComponent } from './components/social-medial-links/social-medial-links.component';
import { SpinnerButtonComponent } from './components/spinner-button/spinner-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TimePipe } from './pipes/time.pipe';
import { UserLogoWithTooltipComponent } from './components/tooltips/user-logo-with-tooltip/user-logo-with-tooltip.component';
import { UserMessageComponent } from './components/user-message/user-message.component';
import { WinLogoWithTooltipComponent } from './components/tooltips/win-logo-with-tooltip/win-logo-with-tooltip.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@NgModule({
    imports: [CommonModule, RouterModule, ChartsModule, ReactiveFormsModule, NgbTooltipModule],
    declarations: [
        ChampionshipLastResultsComponent,
        ChampionshipRatingTableComponent,
        ChampionshipResultsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipUserRatingDetailsComponent,
        ClubLogoWithTooltipComponent,
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        ConfirmationModalComponent,
        DropdownNavigationComponent,
        ErrorComponent,
        InfoComponent,
        LastCommentsComponent,
        LastUserComponent,
        NavigationComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SocialMedialLinksComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe,
        UserLogoWithTooltipComponent,
        UserMessageComponent,
        WinLogoWithTooltipComponent
    ],
    exports: [
        ChampionshipLastResultsComponent,
        ChampionshipRatingTableComponent,
        ChampionshipResultsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipUserRatingDetailsComponent,
        ClubLogoWithTooltipComponent,
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        ConfirmationModalComponent,
        DropdownNavigationComponent,
        ErrorComponent,
        InfoComponent,
        LastCommentsComponent,
        LastUserComponent,
        NavigationComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SocialMedialLinksComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe,
        UserLogoWithTooltipComponent,
        UserMessageComponent,
        WinLogoWithTooltipComponent
    ],
    providers: [TimePipe]
})
export class SharedModule {}
