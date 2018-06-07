import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable()
export class ManageTeamGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router) {}

    canActivate() {
        return this.checkRole();
    }

    canActivateChild() {
        return this.checkRole();
    }

    /**
     * Check if user have acceptable roles to edit team competition
     * @returns {boolean}
     */
    checkRole(): boolean {
        if (!!localStorage.getItem('roles') && !!localStorage.getItem('auth_token')) {
            const userRoles = JSON.parse(localStorage.getItem('roles'));
            const allowedRoles = ['admin', 'team_editor'];
            for (const role in userRoles) {
                if (allowedRoles.indexOf(userRoles[role]) > -1) {
                    return true;
                }
            }
        }
        this.router.navigate(['/403']);
        return false;
    }
}
