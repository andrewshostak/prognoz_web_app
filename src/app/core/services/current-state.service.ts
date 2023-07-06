import { Injectable } from '@angular/core';

import { User } from '@models/v2/user.model';
import { PusherService } from '@services/pusher.service';
import Pusher from 'pusher-js';
import { Subject } from 'rxjs';
import { get, uniq } from 'lodash';

@Injectable()
export class CurrentStateService {
   private user: User = null;
   public onlineUsers: { id: number; name: string }[] = [];
   public onlineUserObservable = new Subject<void>();
   public pusherInstance: Pusher;
   private selectedCupCompetitionId: number;
   private selectedTeamCompetitionId: number;

   constructor(private pusherService: PusherService) {}

   set cupCompetitionId(cupCompetitionId: number) {
      this.selectedCupCompetitionId = cupCompetitionId;
      localStorage.setItem('selectedCupCompetitionId', JSON.stringify(cupCompetitionId));
   }

   get cupCompetitionId(): number {
      return this.selectedCupCompetitionId;
   }

   set teamCompetitionId(teamCompetitionId: number) {
      this.selectedTeamCompetitionId = teamCompetitionId;
      localStorage.setItem('selectedTeamCompetitionId', JSON.stringify(teamCompetitionId));
   }

   get teamCompetitionId(): number {
      return this.selectedTeamCompetitionId;
   }

   public initialize(): void {
      this.selectedTeamCompetitionId = this.getSelectedTeamCompetitionId();
      this.selectedCupCompetitionId = this.getSelectedCupCompetitionId();
   }

   public getUser(): User {
      return this.user;
   }

   public setUser(user: User): void {
      this.user = user;
   }

   public setToken(token: string): void {
      localStorage.setItem('auth_token', token);
   }

   public getPermissions(): string[] {
      const user = this.getUser();
      if (!get(user, 'roles.length')) {
         return [];
      }

      const permissions: string[] = [];
      user.roles.forEach(role => {
         if (!role.permissions) {
            return;
         }

         role.permissions.forEach(permission => {
            permissions.push(permission.slug);
         });
      });

      return uniq(permissions);
   }

   public hasPermissions(permissions: string[], or?: boolean): boolean {
      const userPermissions = this.getPermissions();

      return or
         ? permissions.some(permission => userPermissions.includes(permission))
         : permissions.every(permission => userPermissions.includes(permission));
   }

   public hasRoles(roles: string[], or?: boolean): boolean {
      const user = this.getUser();
      if (!get(user, 'roles.length')) {
         return false;
      }

      const userRoleSlugs = user.roles.map(role => role.slug);

      return or ? roles.some(role => userRoleSlugs.includes(role)) : roles.every(role => userRoleSlugs.includes(role));
   }

   /**
    * Get list of online users (only if user is authenticated)
    * Method updates users list
    * @param {User} user
    */
   public getOnlineUsers(user: User): void {
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

   private getSelectedTeamCompetitionId(): number {
      const selectedTeamCompetitionId = localStorage.getItem('selectedTeamCompetitionId');
      if (!selectedTeamCompetitionId) {
         return null;
      }

      return parseInt(selectedTeamCompetitionId, 10);
   }

   private getSelectedCupCompetitionId(): number {
      const selectedCupCompetitionId = localStorage.getItem('selectedCupCompetitionId');
      if (!selectedCupCompetitionId) {
         return null;
      }

      return parseInt(selectedCupCompetitionId, 10);
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
