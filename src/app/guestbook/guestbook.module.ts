import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { GuestbookMessageService } from '@app/guestbook/shared/guestbook-message.service';
import { SharedModule } from '../shared/shared.module';
import { GuestbookPageComponent } from './guestbook-page/guestbook-page.component';
import { GuestbookRoutingModule } from './guestbook-routing.module';
import { GuestbookComponent } from './guestbook.component';
import { GuestbookMessageFormComponent } from './shared/guestbook-message-form/guestbook-message-form.component';

@NgModule({
   imports: [CommonModule, ReactiveFormsModule, GuestbookRoutingModule, SharedModule],
   declarations: [GuestbookComponent, GuestbookPageComponent, GuestbookMessageFormComponent],
   providers: [GuestbookMessageService],
   exports: [GuestbookComponent]
})
export class GuestbookModule {}
