import { Injectable } from '@angular/core';

import { UserNew } from '@models/new/user-new.model';
import { User } from '@models/user.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { PusherService } from '@services/pusher.service';
import { Subject } from 'rxjs';

@Injectable()
export class CurrentStateService {
   public onlineUsers: any[] = [];
   public onlineUserObservable = new Subject<void>();
   public pusherInstance: any;
   private selectedTeamCompetitionId: number;

   constructor(private authService: AuthNewService, private pusherService: PusherService) {
      this.getOnlineUsers(this.authService.getUser());
   }

   set teamCompetitionId(teamCompetitionId: number) {
      this.selectedTeamCompetitionId = teamCompetitionId;
      localStorage.setItem('selectedTeamCompetitionId', JSON.stringify(teamCompetitionId));
   }

   get teamCompetitionId(): number {
      return this.selectedTeamCompetitionId;
   }

   /**
    * @deprecated all components should use this.authService.getUser()
    */
   public getUser(): User {
      return this.authService.getUser() as User;
   }

   public initialize(): void {
      this.selectedTeamCompetitionId = this.getSelectedTeamCompetitionId();
   }

   /**
    * Get list of online users (only if user is authenticated)
    * Method updates users list
    * @param {User} user
    */
   public getOnlineUsers(user: UserNew): void {
      if (user) {
         this.pusherInstance = this.pusherService.createInstance();
         const subscription = this.pusherService.subscribeToChannel(this.pusherInstance, 'presence-users');

         this.pusherService.bindEvent(subscription, 'pusher:subscription_succeeded', members => {
            this.clearOnlineUsersList();
            members.each(member => {
               this.addOnlineUser(member.id, member.info);
               this.onlineUserObservable.next();
            });
         });

         this.pusherService.bindEvent(subscription, 'pusher:member_added', member => {
            this.addOnlineUser(member.id, member.info);
            this.onlineUserObservable.next();
         });

         this.pusherService.bindEvent(subscription, 'pusher:member_removed', member => {
            this.removeOnlineUser(member.id);
            this.onlineUserObservable.next();
         });
      } else if (this.pusherInstance) {
         this.pusherInstance.disconnect();
         this.clearOnlineUsersList();
         this.onlineUserObservable.next();
      }
   }

   /**
    * Add online user to list
    * @param userId
    * @param userInfo
    */
   private addOnlineUser(userId: string, userInfo: User): void {
      this.onlineUsers.push({ id: parseInt(userId, 10), name: userInfo.name });
   }

   /**
    * Cleat users online list
    */
   private clearOnlineUsersList(): void {
      this.onlineUsers = [];
   }

   /**
    * Get selected team competition id from local storage
    * @returns {number}
    */
   private getSelectedTeamCompetitionId(): number {
      const selectedTeamCompetitionId = localStorage.getItem('selectedTeamCompetitionId');
      if (!selectedTeamCompetitionId) {
         return null;
      }

      return parseInt(selectedTeamCompetitionId, 10);
   }

   /**
    * Remove online user from list
    * @param userId
    */
   private removeOnlineUser(userId): void {
      userId = parseInt(userId, 10);
      this.onlineUsers = this.onlineUsers.filter(user => user.id !== userId);
   }
}
