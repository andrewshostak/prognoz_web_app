import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GuestbookMessage } from '@models/v2/guestbook-message.model';
import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { GuestbookMessageService } from '@app/guestbook/shared/guestbook-message.service';
import { trim } from 'lodash';

@Component({
   selector: 'app-guestbook-message-form',
   templateUrl: './guestbook-message-form.component.html'
})
export class GuestbookMessageFormComponent implements OnInit {
   @Output() public guestbookMessageCreated = new EventEmitter<GuestbookMessage>();

   public guestbookMessageForm: FormGroup;
   public spinnerButton = false;
   public user: User;

   constructor(
      private currentStateService: CurrentStateService,
      private guestbookService: GuestbookMessageService,
      private notificationsService: NotificationsService
   ) {}

   public ngOnInit(): void {
      this.user = this.currentStateService.getUser();

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
