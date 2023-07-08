import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export class NgbModalMock {
   public open(...args: any[]): NgbModalRef {
      return { close: () => {}, componentInstance: 'aaa' } as NgbModalRef;
   }
}
