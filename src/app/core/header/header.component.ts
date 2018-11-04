import { Component, OnInit } from '@angular/core';

import { AuthService } from '@services/auth.service';
import { NotificationsService } from 'angular2-notifications';
import { User } from '@models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    constructor(private authService: AuthService, private notificationsService: NotificationsService) {}

    user: User;

    logout() {
        this.authService.logout().subscribe(
            () => {
                this.notificationsService.info('Успішно', 'Ви вийшли зі свого аккаунту');
            },
            error => {
                this.notificationsService.error('Помилка', error);
            }
        );
    }

    ngOnInit() {
        this.authService.getUser.subscribe(response => (this.user = response));
    }
}
