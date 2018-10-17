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
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ConfirmModalNewComponent } from './components/confirm-modal-new/confirm-modal-new.component';
import { DropdownNavigationComponent } from './components/dropdown-navigation/dropdown-navigation.component';
import { ErrorComponent } from './components/error/error.component';
import { InfoComponent } from './components/info/info.component';
import { LastUserComponent } from './components/last-user/last-user.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { OnlineUsersListComponent } from './components/online-users-list/online-users-list.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SocialMedialLinksComponent } from './components/social-medial-links/social-medial-links.component';
import { SpinnerButtonComponent } from './components/spinner-button/spinner-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TimePipe } from './pipes/time.pipe';

@NgModule({
    imports: [CommonModule, RouterModule, ChartsModule, ReactiveFormsModule],
    declarations: [
        ChampionshipLastResultsComponent,
        ChampionshipRatingTableComponent,
        ChampionshipResultsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipUserRatingDetailsComponent,
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        DropdownNavigationComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        NavigationComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SocialMedialLinksComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe
    ],
    exports: [
        ChampionshipLastResultsComponent,
        ChampionshipRatingTableComponent,
        ChampionshipResultsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipUserRatingDetailsComponent,
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        DropdownNavigationComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        NavigationComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SocialMedialLinksComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe
    ],
    providers: [TimePipe]
})
export class SharedModule {}
