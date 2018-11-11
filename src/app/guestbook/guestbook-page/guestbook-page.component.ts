import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { CurrentStateService } from '@services/current-state.service';
import { GuestbookMessage } from '@models/guestbook-message.model';
import { GuestbookService } from '../shared/guestbook.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-guestbook-page',
    templateUrl: './guestbook-page.component.html',
    styleUrls: ['./guestbook-page.component.scss']
})
export class GuestbookPageComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private currentStateService: CurrentStateService,
        private formBuilder: FormBuilder,
        private guestbookService: GuestbookService,
        private notificationsService: NotificationsService,
        private titleService: TitleService
    ) {}

    addGuestbookMessageForm: FormGroup;
    authenticatedUser: User;
    currentPage: number;
    errorGuestbookMessages: string | Array<string>;
    guestbookMessages: GuestbookMessage[];
    lastPage: number;
    path = '/guestbook/page/';
    perPage: number;
    spinnerButton = false;
    total: number;

    getGuestbookMessagesData() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.titleService.setTitle(`Гостьова${params['number'] ? ', сторінка ' + params['number'] : ''}`);
            this.guestbookService.getGuestbookMessages(params['number']).subscribe(
                response => {
                    if (response) {
                        this.currentPage = response.current_page;
                        this.lastPage = response.last_page;
                        this.perPage = response.per_page;
                        this.total = response.total;
                        this.guestbookMessages = response.data;
                        const userId = this.authenticatedUser ? this.authenticatedUser.id.toString() : '';
                        this.addGuestbookMessageForm.patchValue({ user_id: userId });
                    }
                },
                error => {
                    this.errorGuestbookMessages = error;
                }
            );
        });
    }

    ngOnInit() {
        this.titleService.setTitle('Гостьова');
        this.addGuestbookMessageForm = this.formBuilder.group({
            user_id: ['', [Validators.required]],
            body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
        this.authenticatedUser = this.currentStateService.getUser();
        this.addGuestbookMessageForm.patchValue({ user_id: this.authenticatedUser ? this.authenticatedUser.id : '' });
        this.getGuestbookMessagesData();
    }

    onSubmit() {
        this.spinnerButton = true;
        this.guestbookService.createGuestbookMessage(this.addGuestbookMessageForm.value).subscribe(
            () => {
                this.getGuestbookMessagesData();
                this.spinnerButton = false;
                this.addGuestbookMessageForm.reset({ user_id: this.authenticatedUser.id });
                this.notificationsService.success('Успішно', 'Повідомлення додано');
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
