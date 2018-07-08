import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';

@Injectable()
export class MeGuard implements CanActivate {
    constructor(private currentStateService: CurrentStateService, private router: Router) {}

    canActivate() {
        return this.checkRoles();
    }

    /**
     * Check if there is user userService
     * @returns {boolean}
     */
    checkRoles(): boolean {
        if (this.currentStateService.user) {
            return true;
        }
        this.router.navigate(['/403']);
        return false;
    }
}
