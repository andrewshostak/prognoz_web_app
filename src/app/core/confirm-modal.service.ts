import { Injectable }   from '@angular/core';
import { Subject }      from 'rxjs/Subject';

declare const $: any;

@Injectable()
export class ConfirmModalService {
    constructor() {}

    openModalSubject = new Subject<{
        callback: () => void;
        message?: string;
        confirmInputValue?: string;
    }>();

    show(
        callback: () => void,
        message?: string,
    ): void {
        $('#confirmModal').modal('show');
        this.openModalSubject.next({ callback, message });
    }

    hide(): void {
        $('#confirmModal').modal('hide');
    }
}
