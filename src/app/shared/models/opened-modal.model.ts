import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export class OpenedModal<T> {
   data: T;
   reference: NgbModalRef;
   submitted?: (event) => void;
   message?: string;
}
