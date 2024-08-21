import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@services/api/v2/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { get, values } from 'lodash';

@Component({
   selector: 'app-auth-email-verification',
   templateUrl: './auth-email-verification.component.html',
   styleUrls: []
})
export class AuthEmailVerificationComponent implements OnInit {

   isVerificationInProgress: boolean = false;
   error: string;

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthService,
      private router: Router
   ) {}

   ngOnInit(): void {
      const token = this.activatedRoute.snapshot.params.token;
      this.isVerificationInProgress = true;
      this.authService.emailVerification(token).subscribe(
         () => {
            this.isVerificationInProgress = false;
            this.router.navigate(['/signin']);
         }, (error: HttpErrorResponse) => {
            this.isVerificationInProgress = false;
            const errorObject = get(error, 'error');
            if (errorObject.errors) {
               this.error = values(errorObject.errors).join(',');
            } else if (error?.error?.message) {
               this.error = error.error.message;
            } else {
               this.error = `Невідома помилка. Код - ${error.status}`
            }
         });
   }
}
