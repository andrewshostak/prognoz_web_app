import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-auth-reset',
    templateUrl: './auth-reset.component.html',
    styleUrls: ['./auth-reset.component.scss']
})
export class AuthResetComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private router: Router,
        private titleService: TitleService
    ) {}

    resetForm: FormGroup;
    spinnerButton = false;
    user: User;

    ngOnInit() {
        this.titleService.setTitle('Зміна паролю');
        this.user = this.currentStateService.getUser();
        const emailRegex = '^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$';
        this.activatedRoute.params.subscribe((params: Params) => {
            this.resetForm = new FormGroup({
                email: new FormControl('', [Validators.required, Validators.pattern(emailRegex)]),
                password: new FormControl('', [Validators.required, Validators.minLength(6)]),
                password_confirmation: new FormControl('', [Validators.required]),
                token: new FormControl(params['token'], [Validators.required])
            });
        });
    }

    onSubmit() {
        if (this.resetForm.valid) {
            this.spinnerButton = true;
            this.authService.reset(this.resetForm.value).subscribe(
                () => {
                    this.notificationsService.success(
                        'Успішно',
                        'Відновлення паролю пройшло успішно. Тепер ви можете виконати вхід на сайт.',
                        { timeOut: 0 }
                    );
                    this.spinnerButton = false;
                    this.router.navigate(['/signin']);
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
