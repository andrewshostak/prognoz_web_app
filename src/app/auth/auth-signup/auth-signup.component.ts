import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-auth-signup',
    templateUrl: './auth-signup.component.html',
    styleUrls: ['./auth-signup.component.scss']
})
export class AuthSignupComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private router: Router,
        private titleService: TitleService
    ) {}

    captchaValidity: boolean;
    signUpForm: FormGroup;
    spinnerButton: boolean;
    user: User = this.currentStateService.user;

    ngOnInit() {
        this.titleService.setTitle('Реєстрація');
        this.authService.getUser.subscribe(response => (this.user = response));
        const emailRegex = '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$';
        this.signUpForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password_confirmation: new FormControl('', [Validators.required])
        });
    }

    onSubmit() {
        if (this.signUpForm.valid && this.captchaValidity) {
            this.spinnerButton = true;
            this.authService.signUp(this.signUpForm.value).subscribe(
                response => {
                    this.notificationsService.success('Успішно', 'Реєстрація пройшла успішно', { timeOut: 0 });
                    this.spinnerButton = false;
                    this.router.navigate(['/me']);
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

    resolved(captchaResponse: string): void {
        this.captchaValidity = !!captchaResponse;
    }
}
