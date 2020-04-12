import { Component, OnInit } from '@angular/core';

import { AuthNewService } from '@services/new/auth-new.service';

@Component({
   selector: 'app-guestbook',
   templateUrl: './guestbook.component.html',
   styleUrls: ['./guestbook.component.scss']
})
export class GuestbookComponent implements OnInit {
   public isAuthenticated: boolean = false;

   constructor(private authService: AuthNewService) {}

   public ngOnInit(): void {
      this.isAuthenticated = !!this.authService.getUser();
   }
}
