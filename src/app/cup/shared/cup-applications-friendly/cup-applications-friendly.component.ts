import { Component, Input } from '@angular/core';

import { CupApplication } from '@models/v2/cup/cup-application.model';
import { Competition } from '@models/v2/competition.model';

@Component({
   selector: 'app-cup-applications-friendly',
   templateUrl: './cup-applications-friendly.component.html'
})
export class CupApplicationsFriendlyComponent {
   @Input() cupApplications: CupApplication[];
   @Input() competition: Competition;
}
