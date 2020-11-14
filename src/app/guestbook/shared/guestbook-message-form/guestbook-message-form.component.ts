import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { GuestbookService } from '@app/guestbook/shared/guestbook.service';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-guestbook-message-form',
   templateUrl: './guestbook-message-form.component.html'
})
export class GuestbookMessageFormComponent implements OnInit {
   public guestbookMessageForm: FormGroup;
   public showFormErrorMessage = UtilsService.showFormErrorMessage;
   public showFormInvalidClass = UtilsService.showFormInvalidClass;
   public spinnerButton = false;
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private guestbookService: GuestbookService,
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
      const body = { ...this.guestbookMessageForm.value, user_id: this.user.id };
      this.guestbookService.createGuestbookMessage(body).subscribe(
         () => {
            this.spinnerButton = false;
            this.guestbookMessageForm.reset();
            this.notificationsService.success('Успішно', 'Ваше повідомлення додано');
            // send upd event
         },
         errors => {
            this.spinnerButton = false;
            for (const error of errors) {
               this.notificationsService.error('Помилка', error);
            }
         }
      );
   }
}
