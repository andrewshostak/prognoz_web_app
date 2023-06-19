import { Component, OnInit } from '@angular/core';

import { AuthService } from '@services/v2/auth.service';

@Component({
   selector: 'app-guestbook',
   templateUrl: './guestbook.component.html',
   styleUrls: ['./guestbook.component.scss']
})
export class GuestbookComponent implements OnInit {
   public isAuthenticated: boolean = false;

   constructor(private authService: AuthService) {}

   public ngOnInit(): void {
      this.isAuthenticated = !!this.authService.getUser();
   }
}
