import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { AuthService } from '@services/api/v2/auth.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '@env';

@Component({
   selector: 'app-auth-sign-up',
   templateUrl: './auth-sign-up.component.html',
   styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {
   public captchaValidity: boolean;
   public signUpForm: FormGroup;
   public spinnerButton: boolean;
   public user: User;
   reCaptchaSiteKey = environment.reCaptchaSiteKey;

   constructor(
      private authService: AuthService,
      private currentStateService: CurrentStateService,
      private notificationsService: NotificationsService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Реєстрація');
      this.user = this.currentStateService.getUser();
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
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Дані збережено');
            this.router.navigate(['/waiting-email-verification', encodeURIComponent(this.signUpForm.get('email').value)]);
         },
         () => (this.spinnerButton = false)
      );
   }

   public resolved(captchaResponse: string): void {
      this.captchaValidity = !!captchaResponse;
   }
}
