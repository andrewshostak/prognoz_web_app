import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { User } from '@models/v2/user.model';
import { AuthService } from '@services/api/v2/auth.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';
import { CurrentStateService } from '@services/current-state.service';

@Component({
   selector: 'app-auth-reset',
   templateUrl: './auth-reset.component.html',
   styleUrls: ['./auth-reset.component.scss']
})
export class AuthResetComponent implements OnInit {
   public resetForm: FormGroup;
   public spinnerButton: boolean;
   public user: User;

   constructor(
      private currentStateService: CurrentStateService,
      private activatedRoute: ActivatedRoute,
      private authService: AuthService,
      private notificationsService: NotificationsService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public ngOnInit() {
      this.titleService.setTitle('Зміна паролю');
      this.user = this.currentStateService.getUser();
      const emailRegex = '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$';
      this.activatedRoute.params.subscribe((params: Params) => {
         this.resetForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password_confirmation: new FormControl('', [Validators.required]),
            token: new FormControl(params.token, [Validators.required])
         });
      });
   }

   public onSubmit() {
      if (this.resetForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      this.authService.reset(this.resetForm.value).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Зміна паролю пройшла успішно. Виконайте вхід на сайт з новим паролем.', {
               timeOut: 0
            });
            this.router.navigate(['/signin']);
         },
         () => (this.spinnerButton = false)
      );
   }
}
