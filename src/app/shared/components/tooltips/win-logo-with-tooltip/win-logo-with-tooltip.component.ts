import { Component, Input } from '@angular/core';

import { environment } from '@env';
import { Win } from '@models/win.model';

@Component({
    selector: 'app-win-logo-with-tooltip',
    templateUrl: './win-logo-with-tooltip.component.html',
    styleUrls: ['./win-logo-with-tooltip.component.scss']
})
export class WinLogoWithTooltipComponent {
    @Input() win: Win;

    awardsImagesUrl: string = environment.apiImageAwards;
}
