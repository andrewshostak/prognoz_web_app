import { Component, OnInit, OnDestroy }         from '@angular/core';
import { Router, ActivatedRoute, Params }       from '@angular/router';
import { NotificationsService }                 from 'angular2-notifications';
import { DomSanitizer }                         from '@angular/platform-browser';
import { Subscription }                         from 'rxjs/Subscription';

import { AuthService }                          from '../../shared/auth.service';
import { BroadcastService }                     from '../../shared/broadcast.service';
import { CurrentStateService }                  from '../../shared/current-state.service';
import { GuestbookService }                     from '../shared/guestbook.service';
import { GuestbookMessage }                     from '../../shared/models/guestbook-message.model';
import { User }                                 from '../../shared/models/user.model';
import { environment }                          from '../../../environments/environment';

declare var $:any;

@Component({
    selector: 'app-guestbook-page',
    templateUrl: './guestbook-page.component.html',
    styleUrls: ['./guestbook-page.component.css']
})
export class GuestbookPageComponent implements OnInit, OnDestroy {

    constructor(
        private activatedRoute: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private notificationService: NotificationsService,
        private router: Router,
        private authService: AuthService,
        private broadcastService: BroadcastService,
        private currentStateService: CurrentStateService,
        private guestbookService: GuestbookService,
    ) { }

    guestbookMessages: GuestbookMessage[];
    errorGuestbookMessages: string | Array<string>;
    spinnerGuestbookMessages: boolean = false;
    noGuestbookMessages: string = 'В базі даних повідомлень не знайдено.';
    userImagesUrl: string = environment.API_IMAGE_USERS;
    userImageDefault: string = environment.IMAGE_USER_DEFAULT;
    path: string = '/guestbook/page/';

    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    guestbookMessageBody: string;

    authenticatedUser: User = this.currentStateService.user;
    userSubscription: Subscription;
    editedMessage: GuestbookMessage = { id: null, user_id: null, body: '' };

    spinnerEditButton: boolean = false;
    spinnerButton: boolean = false;
    isEditedMessage: boolean = false;

    showEditor: boolean = false;

    ngOnInit() {
        this.userSubscription = this.authService.getUser.subscribe(result => {
            this.authenticatedUser = result;
        });
        this.getGuestbookPage();
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    private getGuestbookPage() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.resetData();
            this.spinnerGuestbookMessages = true;
            this.showEditor = !params['number'] ? true : false;
            this.guestbookService.getGuestbookMessages(params['number']).subscribe(
                result => {
                    if (result) {
                        this.currentPage = result.current_page;
                        this.lastPage = result.last_page;
                        this.perPage = result.per_page;
                        this.total = result.total;
                    }
                    this.guestbookMessages = result ? result.data : [];
                    this.spinnerGuestbookMessages = false;
                },
                error => {
                    this.errorGuestbookMessages = error;
                    this.spinnerGuestbookMessages = false;
                }
            )
        });
    }

    addMessage() {
        this.spinnerButton = true;
        this.guestbookService.createGuestbookMessage
            ({
                body: this.guestbookMessageBody,
                user_id: this.authenticatedUser.id,
                id: null
            })
            .subscribe(
                response => {
                    this.resetGuestbookMessage();
                    this.getGuestbookPage();
                    this.spinnerButton = false;
                    this.notificationService.success('Успішно', 'Повідомлення додано');
                },
                errors => {
                    for (let error of errors) {
                        this.notificationService.error('Помилка', error);
                    }
                    this.spinnerButton = false;
                }
            );
    }

    updateMessage() {
        this.spinnerEditButton = true;
        let updatedMessage = {
            id: this.editedMessage.id,
            user_id: this.authenticatedUser.id,
            body: this.guestbookMessageBody
        };
        this.guestbookService.updateGuestbookMessage(updatedMessage).subscribe(
            response => {
                this.resetGuestbookMessage();
                this.getGuestbookPage();
                this.spinnerEditButton = false;
                this.notificationService.success('Успішно', 'Повідомлення змінено');
            },
            errors => {
                for (let error of errors) {
                    this.notificationService.error('Помилка', error);
                }
                this.spinnerEditButton = false;
            }
        );
    }

    addMessageToEditor(message: GuestbookMessage) {
        if (this.authenticatedUser.id === message.user_id) {
            this.editedMessage = Object.assign({}, message);
            this.isEditedMessage = true;
            setTimeout(() => {
                let event = new Event('updateContent');
                this.broadcastService.next(event);
                window.scrollTo(0, $('#body-add')[0].scrollTop);
            });
        }
    }

    keyupHandler(event) {
        this.guestbookMessageBody = event;
    }

    assembleHTMLItem(message: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(message);
    }

    resetGuestbookMessage() {
        this.guestbookMessageBody = '';
        this.editedMessage.body = '';
        this.isEditedMessage = false;
        let event = new Event('resetContent');
        this.broadcastService.next(event);
    }

    private resetData() {
        this.guestbookMessages = null;
        this.errorGuestbookMessages = null;
    }
}