import { Component, Input } from '@angular/core';

import { CupApplicationNew } from '@models/v2/cup-application-new.model';
import { CompetitionNew } from '@models/v2/competition-new.model';

@Component({
   selector: 'app-cup-applications-friendly',
   templateUrl: './cup-applications-friendly.component.html'
})
export class CupApplicationsFriendlyComponent {
   @Input() cupApplications: CupApplicationNew[];
   @Input() competition: CompetitionNew;
}
