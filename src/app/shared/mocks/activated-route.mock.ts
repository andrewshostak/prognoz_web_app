import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

export class ActivatedRouteMock extends ActivatedRoute {
   constructor() {
      super();
      this.params = of({ pageNumber: '1' });
   }
}
