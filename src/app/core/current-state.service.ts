import { Injectable }       from '@angular/core';

import { AuthService }      from './auth.service';
import { PusherService }    from './pusher.service';
import { Subject }          from 'rxjs/Subject';
import { User }             from '../shared/models/user.model';

@Injectable()
export class CurrentStateService {

    constructor(
        private authService: AuthService,
        private pusherService: PusherService
    ) {
        this.authService.getUser.subscribe(response => {
            this.user = response;
            this.getOnlineUsers(response);
        });
    }

    onlineUsers: Array<any> = [];
    onlineUserObservable = new Subject<void>();
    pusherInstance: any;
    user: User;

    initialize(): void {
        this.authService.initializeUser();
    }

    /**
     * Add online user to list
     * @param userId
     * @param userInfo
     */
    private addOnlineUser(userId: string, userInfo: User): void {
        this.onlineUsers.push({id: parseInt(userId), name: userInfo.name});
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

            this.pusherService.bindEvent(subscription, 'pusher:subscription_succeeded', (members) => {
                this.clearOnlineUsersList();
                members.each((member) => {
                    this.addOnlineUser(member.id, member.info);
                    this.onlineUserObservable.next();
                });
            });

            this.pusherService.bindEvent(subscription, 'pusher:member_added', (member) => {
                this.addOnlineUser(member.id, member.info);
                this.onlineUserObservable.next();
            });

            this.pusherService.bindEvent(subscription, 'pusher:member_removed', (member) => {
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
     * Remove online user from list
     * @param userId
     */
    private removeOnlineUser(userId): void {
        userId = parseInt(userId);
        this.onlineUsers = this.onlineUsers.filter(user => user.id !== userId);
    }

    private clearOnlineUsersList(): void {
        this.onlineUsers = [];
    }
}
