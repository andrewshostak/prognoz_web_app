import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserNew } from '@models/new/user-new.model';
import { CurrentStateService } from '@services/current-state.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-auth-sign-up',
   templateUrl: './auth-sign-up.component.html',
   styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {
   public captchaValidity: boolean;
   public signUpForm: FormGroup;
   public spinnerButton: boolean;
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private currentStateService: CurrentStateService,
      private notificationsService: NotificationsService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Реєстрація');
      this.user = this.authService.getUser();
      const emailRegex = '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$';
      this.signUpForm = new FormGroup({
         name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
         email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
         password: new FormControl('', [Validators.required, Validators.minLength(6)]),
         password_confirmation: new FormControl('', [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.signUpForm.invalid || !this.captchaValidity) {
         return;
      }

      this.spinnerButton = true;
      this.authService.signUp(this.signUpForm.value).subscribe(
         response => {
            this.setAuthData(response);
            this.currentStateService.getOnlineUsers(response.user);
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Реєстрація успішна');
            this.router.navigate(['/me']);
         },
         () => (this.spinnerButton = false)
      );
   }

   public resolved(captchaResponse: string): void {
      this.captchaValidity = !!captchaResponse;
   }

   private setAuthData(response: { token: string; user: UserNew }): void {
      this.authService.setUser(response.user);
      this.authService.setToken(response.token);
   }

   // todo: move re-captcha siteKey to env vars
}
