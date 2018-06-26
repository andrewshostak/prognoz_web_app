import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-confirm-modal',
    templateUrl: './confirm-modal.component.html',
    styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
    @Input() data: any;
    @Input() message: string;
    @Input() modalId: string;
    @Input() spinnerButton: boolean;
    @Output() confirmed = new EventEmitter<any>();

    constructor() {}

    confirm() {
        this.confirmed.emit(this.data);
    }
}
