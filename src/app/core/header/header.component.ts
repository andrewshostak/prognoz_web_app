import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

    headerSignInForm: FormGroup;
    spinnerButton = false;
    user: User;

    logout() {
        this.authService.logout().subscribe(
            response => {
                this.notificationsService.info('Успішно', 'Ви вийшли зі свого аккаунту');
            },
            error => {
                this.notificationsService.error('Помилка', error);
            }
        );
    }

    ngOnInit() {
        this.authService.getUser.subscribe(response => (this.user = response));
        this.headerSignInForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3)]),
            password: new FormControl('', [Validators.required])
        });
    }

    onSubmit() {
        if (this.headerSignInForm.valid) {
            this.spinnerButton = true;
            this.authService.signIn(this.headerSignInForm.value.name, this.headerSignInForm.value.password).subscribe(
                response => {
                    this.notificationsService.success('Успішно', 'Вхід виконано успішно');
                    this.spinnerButton = false;
                },
                errors => {
                    for (const error of errors) {
                        this.notificationsService.error('Помилка', error);
                    }
                    this.spinnerButton = false;
                }
            );
        }
    }
}
