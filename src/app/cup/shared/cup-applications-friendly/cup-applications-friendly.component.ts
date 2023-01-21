import { Component, Input } from '@angular/core';

import { CupApplicationNew } from '@models/new/cup-application-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';

@Component({
   selector: 'app-cup-applications-friendly',
   templateUrl: './cup-applications-friendly.component.html'
})
export class CupApplicationsFriendlyComponent {
   @Input() cupApplications: CupApplicationNew[];
   @Input() competition: CompetitionNew;
}
