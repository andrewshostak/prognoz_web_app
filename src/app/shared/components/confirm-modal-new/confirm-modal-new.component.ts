import { Component, OnInit } from '@angular/core';

import { ConfirmModalService } from '../../../core/services/confirm-modal.service';

declare const $: any;

@Component({
    selector: 'app-confirm-modal-new',
    templateUrl: './confirm-modal-new.component.html',
    styleUrls: ['./confirm-modal-new.component.css']
})
export class ConfirmModalNewComponent implements OnInit {
    constructor(private confirmModalService: ConfirmModalService) {}

    defaultMessage: string;
    onConfirm: () => void;
    message: string;

    ngOnInit() {
        this.defaultMessage = 'Ви впевнені що хочете продовжити?';
        this.confirmModalService.openModalSubject.subscribe(response => {
            this.onConfirm = response.callback;
            this.message = response.message || this.defaultMessage;
        });
    }

    onModalConfirm(): void {
        this.onConfirm();
    }
}
