import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-online-users-list',
   templateUrl: './online-users-list.component.html',
   styleUrls: ['./online-users-list.component.scss']
})
export class OnlineUsersListComponent implements OnDestroy, OnInit {
   constructor(private currentStateService: CurrentStateService) {}

   users: Partial<User>[] = [];
   onlineUserSubscription: Subscription;

   ngOnDestroy() {
      if (!this.onlineUserSubscription.closed) {
         this.onlineUserSubscription.unsubscribe();
      }
   }

   ngOnInit() {
      this.users = this.sortUsers(this.currentStateService.onlineUsers);
      this.onlineUserSubscription = this.currentStateService.onlineUserObservable.subscribe(() => {
         this.users = this.sortUsers(this.currentStateService.onlineUsers);
      });
   }

   private sortUsers(users: { id: number; name: string }[]): { id: number; name: string }[] {
      return users.sort((a, b) => {
         return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
   }
}
