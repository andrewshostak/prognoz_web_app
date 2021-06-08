import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export class OpenedModal<T> {
   public data: T;
   public reference: NgbModalRef;
   public submitted?: (event) => void;
   public message?: string;
}
