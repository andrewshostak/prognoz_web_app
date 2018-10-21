import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Comment } from '@models/comment.model';
import { environment } from '@env';
import { GuestbookMessage } from '@models/guestbook-message.model';
import { DomSanitizer } from '@angular/platform-browser';

declare const $: any;

@Component({
    selector: 'app-user-message',
    templateUrl: './user-message.component.html',
    styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent implements OnDestroy, OnInit {
    constructor(private domSanitizer: DomSanitizer) {}

    @Input() message: Comment | GuestbookMessage;

    awardsImagesUrl: string = environment.apiImageAwards;
    clubImagesUrl: string = environment.apiImageClubs;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    assembleHTMLItem(message: string) {
        return this.domSanitizer.bypassSecurityTrustHtml(message);
    }

    ngOnDestroy() {
        $('[data-toggle="tooltip"]').tooltip('dispose');
    }

    ngOnInit() {
        $(() => $('[data-toggle="tooltip"]').tooltip());
    }
}
