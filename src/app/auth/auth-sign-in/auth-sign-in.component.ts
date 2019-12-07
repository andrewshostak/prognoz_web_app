import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-auth-sign-in',
   templateUrl: './auth-sign-in.component.html',
   styleUrls: ['./auth-sign-in.component.scss']
})
export class AuthSignInComponent implements OnInit {
   public signInForm: FormGroup;
   public spinnerButton: boolean;
   public user: UserNew;

   constructor(
      private authService: AuthNewService,
      private notificationsService: NotificationsService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Вхід');
      this.user = this.authService.getUser();
      this.signInForm = new FormGroup({
         name: new FormControl('', [Validators.required, Validators.minLength(3)]),
         password: new FormControl('', [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.signInForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      this.authService.signIn(this.signInForm.value).subscribe(
         response => {
            this.setAuthData(response);
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Вхід виконано успішно');
            this.router.navigate(['/championship', 'predictions']);
         },
         () => (this.spinnerButton = false)
      );
   }

   private setAuthData(response: { token: string; user: UserNew }): void {
      this.authService.setUser(response.user);
      this.authService.setToken(response.token);
   }
}
