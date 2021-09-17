import { Component, Input } from '@angular/core';

import { Win } from '@models/win.model';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-win-logo-with-tooltip',
   templateUrl: './win-logo-with-tooltip.component.html',
   styleUrls: ['./win-logo-with-tooltip.component.scss']
})
export class WinLogoWithTooltipComponent {
   @Input() win: Win;

   private awardsLogosPath: string = SettingsService.awardsLogosPath + '/';

   get src(): string {
      return this.awardsLogosPath + this.win.award.image;
   }
}
