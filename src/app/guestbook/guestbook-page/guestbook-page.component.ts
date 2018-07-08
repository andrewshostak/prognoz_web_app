import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { GuestbookMessage } from '@models/guestbook-message.model';
import { GuestbookService } from '../shared/guestbook.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

declare const $: any;

@Component({
    selector: 'app-guestbook-page',
    templateUrl: './guestbook-page.component.html',
    styleUrls: ['./guestbook-page.component.css']
})
export class GuestbookPageComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private currentStateService: CurrentStateService,
        private domSanitizer: DomSanitizer,
        private formBuilder: FormBuilder,
        private guestbookService: GuestbookService,
        private notificationService: NotificationsService,
        private titleService: TitleService
    ) {}

    addGuestbookMessageForm: FormGroup;
    authenticatedUser: User = this.currentStateService.user;
    awardsImagesUrl: string = environment.apiImageAwards;
    clubImagesUrl: string = environment.apiImageClubs;
    currentPage: number;
    errorGuestbookMessages: string | Array<string>;
    guestbookMessages: GuestbookMessage[];
    lastPage: number;
    path = '/guestbook/page/';
    perPage: number;
    spinnerButton = false;
    total: number;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

    assembleHTMLItem(message: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(message);
    }

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
                        $(() => $('[data-toggle="tooltip"]').tooltip());
                    }
                },
                error => {
                    this.errorGuestbookMessages = error;
                }
            );
        });
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
        $('[data-toggle="tooltip"]').tooltip('dispose');
    }

    ngOnInit() {
        this.titleService.setTitle('Гостьова');
        this.addGuestbookMessageForm = this.formBuilder.group({
            user_id: ['', [Validators.required]],
            body: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            this.addGuestbookMessageForm.patchValue({ user_id: response ? response.id : '' });
        });
        this.getGuestbookMessagesData();
    }

    onSubmit() {
        this.spinnerButton = true;
        this.guestbookService.createGuestbookMessage(this.addGuestbookMessageForm.value).subscribe(
            response => {
                this.getGuestbookMessagesData();
                this.spinnerButton = false;
                this.addGuestbookMessageForm.reset({ user_id: this.authenticatedUser.id });
                this.notificationService.success('Успішно', 'Повідомлення додано');
            },
            errors => {
                for (const error of errors) {
                    this.notificationService.error('Помилка', error);
                }
                this.spinnerButton = false;
            }
        );
    }
}
