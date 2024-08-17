import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule } from 'ng-recaptcha';
import { SharedModule } from '../shared/shared.module';
import { AuthRecoveryComponent } from './auth-recovery/auth-recovery.component';
import { AuthResetComponent } from './auth-reset/auth-reset.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthSignInComponent } from './auth-sign-in/auth-sign-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { AuthComponent } from './auth.component';
import { AuthWaitingEmailVerificationComponent } from './auth-waiting-email-verification/auth-waiting-email-verification.component';
import { AuthEmailVerificationComponent } from './auth-email-verification/auth-email-verification.component';

@NgModule({
   imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule, RecaptchaModule],
   declarations: [
      AuthComponent,
      AuthRecoveryComponent,
      AuthResetComponent,
      AuthSignInComponent,
      AuthSignUpComponent,
      AuthWaitingEmailVerificationComponent,
      AuthEmailVerificationComponent
   ],
   exports: [AuthComponent]
})
export class AuthModule {}
