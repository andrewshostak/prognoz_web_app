import { Component, Input } from '@angular/core';

import { ChampionshipRatingNew } from '@models/new/championship-rating-new.model';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-championship-rating-table',
   templateUrl: './championship-rating-table.component.html',
   styleUrls: ['./championship-rating-table.component.scss']
})
export class ChampionshipRatingTableComponent {
   @Input() rating: Partial<ChampionshipRatingNew>[];
   @Input() error: string;
   @Input() authenticatedUser: any;

   getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
   makeUnsigned = UtilsService.makeUnsigned;
}
