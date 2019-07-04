import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export class NgbModalMock {
   public readonly reference = { close: () => {}, componentInstance: 'aaa' } as NgbModalRef;

   public open(): NgbModalRef {
      return this.reference as NgbModalRef;
   }
}
