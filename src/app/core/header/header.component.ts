import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { User } from '@models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(private authService: AuthService, private notificationsService: NotificationsService, private router: Router) {}

    user: User;

    logout() {
        this.router.navigate(['/']);
        this.authService.logout().subscribe(
            () => {
                this.notificationsService.info('Успішно', 'Ви вийшли зі свого аккаунту');
            },
            () => {
                this.notificationsService.info('Успішно', 'Ви вийшли зі свого аккаунту');
            }
        );
    }

    ngOnInit() {
        this.authService.getUser.subscribe(response => (this.user = response));
    }
}
