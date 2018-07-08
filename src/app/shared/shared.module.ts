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
import { OnlineUsersListComponent } from './components/online-users-list/online-users-list.component';
import { SpinnerButtonComponent } from './components/spinner-button/spinner-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TimePipe } from './pipes/time.pipe';

@NgModule({
    imports: [CommonModule, RouterModule, ChartsModule, ReactiveFormsModule, SimpleNotificationsModule],
    declarations: [
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        PaginationComponent,
        OnlineUsersListComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe
    ],
    exports: [
        ConfirmModalComponent,
        ConfirmModalNewComponent,
        ErrorComponent,
        InfoComponent,
        LastUserComponent,
        OnlineUsersListComponent,
        PaginationComponent,
        SpinnerComponent,
        SpinnerButtonComponent,
        TimePipe
    ],
    providers: [TimePipe]
})
export class SharedModule {}
