import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Device } from '@models/device.model';
import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { DeviceService } from '@services/device.service';
import { AuthNewService } from '@services/v2/auth-new.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';
import { from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-auth-sign-in',
   templateUrl: './auth-sign-in.component.html',
   styleUrls: ['./auth-sign-in.component.scss']
})
export class AuthSignInComponent implements OnInit {
   public signInForm: FormGroup;
   public spinnerButton: boolean;
   public user: User;

   constructor(
      private authService: AuthNewService,
      private currentStateService: CurrentStateService,
      private deviceService: DeviceService,
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

      from(this.deviceService.getDevice())
         .pipe(
            catchError(() => of(DeviceService.emptyDevice)),
            mergeMap((device: Device) => {
               return this.authService.signIn({
                  ...this.signInForm.value,
                  deviceId: device.fingerprint,
                  deviceInfo: device.info
               });
            })
         )
         .subscribe(
            response => {
               this.setAuthData(response);
               this.currentStateService.getOnlineUsers(response.user);
               this.spinnerButton = false;
               this.notificationsService.success('Успішно', 'Вхід виконано успішно');
               this.router.navigate(['/championship', 'predictions']);
            },
            () => (this.spinnerButton = false)
         );
   }

   private setAuthData(response: { token: string; user: User }): void {
      this.authService.setUser(response.user);
      this.authService.setToken(response.token);
   }
}
