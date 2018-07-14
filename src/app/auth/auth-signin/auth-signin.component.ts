import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-auth-signin',
    templateUrl: './auth-signin.component.html',
    styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private router: Router,
        private titleService: TitleService
    ) {}

    signInForm: FormGroup;
    spinnerButton = false;
    user: User = this.currentStateService.user;

    ngOnInit() {
        this.titleService.setTitle('Вхід');
        this.authService.getUser.subscribe(response => (this.user = response));
        this.signInForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3)]),
            password: new FormControl('', [Validators.required])
        });
    }

    onSubmit() {
        if (this.signInForm.valid) {
            this.spinnerButton = true;
            this.authService.signIn(this.signInForm.value.name, this.signInForm.value.password).subscribe(
                response => {
                    this.notificationsService.success('Успішно', 'Вхід виконано успішно');
                    this.spinnerButton = false;
                    this.router.navigate(['/championship/predictions']);
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
