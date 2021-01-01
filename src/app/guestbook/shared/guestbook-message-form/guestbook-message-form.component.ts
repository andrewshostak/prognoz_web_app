import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GuestbookMessageNew } from '@models/new/guestbook-message-new.model';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { GuestbookMessageNewService } from '@app/guestbook/shared/guestbook-message-new.service';
import { trim } from 'lodash';

@Component({
   selector: 'app-guestbook-message-form',
   templateUrl: './guestbook-message-form.component.html'
})
export class GuestbookMessageFormComponent implements OnInit {
   @Output() public guestbookMessageCreated = new EventEmitter<GuestbookMessageNew>();

   public guestbookMessageForm: FormGroup;
   public showFormErrorMessage = UtilsService.showFormErrorMessage;
   public showFormInvalidClass = UtilsService.showFormInvalidClass;
   public spinnerButton = false;
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private guestbookService: GuestbookMessageNewService,
      private notificationsService: NotificationsService
   ) {}

   public ngOnInit(): void {
      this.user = this.authService.getUser();

      this.guestbookMessageForm = new FormGroup({
         body: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
      });
   }

   public submit(): void {
      if (this.guestbookMessageForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      const message = { body: trim(this.guestbookMessageForm.get('body').value) };
      this.guestbookService.createGuestbookMessage(message).subscribe(
         response => {
            this.spinnerButton = false;
            this.guestbookMessageForm.reset();
            this.notificationsService.success('Успішно', 'Повідомлення додано');
            this.guestbookMessageCreated.emit(response);
         },
         () => (this.spinnerButton = false)
      );
   }
}
