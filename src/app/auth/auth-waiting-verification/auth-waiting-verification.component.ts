import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
   selector: 'app-auth-waiting-verification',
   templateUrl: './auth-waiting-verification.component.html',
   styleUrls: []
})
export class AuthWaitingVerificationComponent implements OnInit {
   email;
   message;

   constructor(private activatedRoute: ActivatedRoute) {}

   ngOnInit(): void {
      this.email = decodeURIComponent(this.activatedRoute.snapshot.params.email);
      this.message = `Ми щойно надіслали лист на вашу електронну адресу ${this.email}. Перевірте вхідні повідомлення та натисніть кнопку "Підтвердити email", щоб завершити реєстрацію. Зверніть увагу: лист може потрапити до папки "Спам".`;
   }
}
