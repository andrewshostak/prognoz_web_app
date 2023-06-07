import { Component, Input } from '@angular/core';

import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-championship-rating-table',
   templateUrl: './championship-rating-table.component.html',
   styleUrls: ['./championship-rating-table.component.scss']
})
export class ChampionshipRatingTableComponent {
   @Input() rating: Partial<ChampionshipRating>[];
   @Input() authenticatedUser: any;

   getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
   makeUnsigned = UtilsService.makeUnsigned;
}
