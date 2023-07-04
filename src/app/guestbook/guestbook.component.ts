import { Component, OnInit } from '@angular/core';

import { CurrentStateService } from '@services/current-state.service';

@Component({
   selector: 'app-guestbook',
   templateUrl: './guestbook.component.html',
   styleUrls: ['./guestbook.component.scss']
})
export class GuestbookComponent implements OnInit {
   public isAuthenticated: boolean = false;

   constructor(private currentStateService: CurrentStateService) {}

   public ngOnInit(): void {
      this.isAuthenticated = !!this.currentStateService.getUser();
   }
}
