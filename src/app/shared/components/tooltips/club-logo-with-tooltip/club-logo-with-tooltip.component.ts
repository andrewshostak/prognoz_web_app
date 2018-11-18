import { Component, Input } from '@angular/core';

import { Club } from '@models/club.model';
import { environment } from '@env';

@Component({
    selector: 'app-club-logo-with-tooltip',
    templateUrl: './club-logo-with-tooltip.component.html',
    styleUrls: ['./club-logo-with-tooltip.component.scss']
})
export class ClubLogoWithTooltipComponent {
    @Input() club: Club;

    clubImagesUrl: string = environment.apiImageClubs;
}
