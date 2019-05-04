import { CanActivate, CanActivateChild } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ManageMatchGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService) {}

    canActivate() {
        return this.authService.canActivate(['admin', 'match_editor']);
    }

    canActivateChild() {
        return this.authService.canActivate(['admin', 'match_editor']);
    }
}
