import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { Subscription } from 'rxjs';
import { sortBy } from 'lodash';

@Component({
   selector: 'app-online-users-list',
   templateUrl: './online-users-list.component.html',
   styleUrls: ['./online-users-list.component.scss']
})
export class OnlineUsersListComponent implements OnDestroy, OnInit {
   constructor(private currentStateService: CurrentStateService) {}

   users: User[] = [];
   onlineUserSubscription: Subscription;

   ngOnDestroy() {
      if (!this.onlineUserSubscription.closed) {
         this.onlineUserSubscription.unsubscribe();
      }
   }

   ngOnInit() {
      this.users = this.currentStateService.onlineUsers;
      this.onlineUserSubscription = this.currentStateService.onlineUserObservable.subscribe(() => {
         this.users = sortBy(this.currentStateService.onlineUsers, ['name']);
      });
   }
}
