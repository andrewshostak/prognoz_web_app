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

@NgModule({
   imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, SharedModule, RecaptchaModule.forRoot()],
   declarations: [AuthComponent, AuthRecoveryComponent, AuthResetComponent, AuthSignInComponent, AuthSignUpComponent],
   exports: [AuthComponent]
})
export class AuthModule {}
