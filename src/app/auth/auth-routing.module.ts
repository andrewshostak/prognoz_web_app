import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthRecoveryComponent } from './auth-recovery/auth-recovery.component';
import { AuthResetComponent } from './auth-reset/auth-reset.component';
import { AuthSignInComponent } from './auth-sign-in/auth-sign-in.component';
import { AuthSignUpComponent } from './auth-sign-up/auth-sign-up.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
   {
      path: '',
      component: AuthComponent,
      children: [
         {
            path: 'recovery',
            component: AuthRecoveryComponent
         },
         {
            path: 'reset/:token',
            component: AuthResetComponent
         },
         {
            path: 'signin',
            component: AuthSignInComponent
         },
         {
            path: 'signup',
            component: AuthSignUpComponent
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class AuthRoutingModule {}
