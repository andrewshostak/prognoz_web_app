import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { ConfirmModalNewComponent } from './components/confirm-modal-new/confirm-modal-new.component';
import { ErrorComponent } from './components/error/error.component';
import { InfoComponent } from './components/info/info.component';
import { LastUserComponent } from './components/last-user/last-user.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { OnlineUsersListComponent } from './components/online-users-list/online-users-list.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SpinnerButtonComponent } from './components/spinner-button/spinner-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TimePipe } from './pipes/time.pipe';
import { ChampionshipRatingTableComponent } from '../championship/shared/championship-rating-table/championship-rating-table.component';
import { ChampionshipResultsTableComponent } from '../championship/shared/championship-results-table/championship-results-table.component';
import { ChampionshipUserRatingDetailsComponent } from './components/championship/championship-user-rating-details/championship-user-rating-details.component';
import { ChampionshipUserPredictionsTableComponent } from './components/championship/championship-user-predictions-table/championship-user-predictions-table.component';

@NgModule({
    imports: [CommonModule, RouterModule, ChartsModule, ReactiveFormsModule],
    declarations: [
        ChampionshipRatingTableComponent,
        ChampionshipResultsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipUserRatingDetailsComponent,
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        NavigationComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe
    ],
    exports: [
        ChampionshipRatingTableComponent,
        ChampionshipResultsTableComponent,
        ChampionshipUserPredictionsTableComponent,
        ChampionshipUserRatingDetailsComponent,
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        NavigationComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe
    ],
    providers: [TimePipe]
})
export class SharedModule {}
