import { Injectable } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { PusherService } from '@services/pusher.service';
import { Subject } from 'rxjs/Subject';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Injectable()
export class CurrentStateService {
    constructor(private authService: AuthService, private pusherService: PusherService) {
        this.authService.getUser.subscribe(response => {
            this.user = response;
            this.getOnlineUsers(response);
        });
    }

    onlineUsers: Array<any> = [];
    onlineUserObservable = new Subject<void>();
    pusherInstance: any;
    user: User;

    private selectedTeamCompetitionId: number;

    set teamCompetitionId(teamCompetitionId: number) {
        this.selectedTeamCompetitionId = teamCompetitionId;
        localStorage.setItem('selectedTeamCompetitionId', JSON.stringify(teamCompetitionId));
    }

    get teamCompetitionId(): number {
        return this.selectedTeamCompetitionId;
    }

    getUser(): User {
        if (!this.user) {
            return UtilsService.getItemFromLocalStorage('user');
        }

        return this.user;
    }

    initialize(): void {
        this.authService.initializeUser();
        this.selectedTeamCompetitionId = this.getSelectedTeamCompetitionId();
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
     * Get list of online users (only if user is authenticated)
     * Method updates users list
     * @param {User} user
     */
    private getOnlineUsers(user: User): void {
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
