import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from '@models/v2/user.model';
import { AuthNewService } from '@services/v2/auth-new.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-auth-recovery',
   templateUrl: './auth-recovery.component.html',
   styleUrls: ['./auth-recovery.component.scss']
})
export class AuthRecoveryComponent implements OnInit {
   public captchaValidity: boolean;
   public recoveryForm: FormGroup;
   public spinnerButton: boolean;
   public user: User;

   constructor(
      private authService: AuthNewService,
      private notificationsService: NotificationsService,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Відновлення паролю');
      this.user = this.authService.getUser();
      const emailRegex = '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$';
      this.recoveryForm = new FormGroup({
         email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)])
      });
   }

   public onSubmit() {
      if (this.recoveryForm.invalid || !this.captchaValidity) {
         return;
      }

      this.spinnerButton = true;
      this.authService.recovery(this.recoveryForm.value.email).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Подальші інструкції відправлено на ваш email', { timeOut: 0 });
            this.recoveryForm.get('email').disable();
         },
         () => (this.spinnerButton = false)
      );
   }

   public resolved(captchaResponse: string): void {
      this.captchaValidity = !!captchaResponse;
   }

   // TODO: move re-captcha siteKey to env vars
}
