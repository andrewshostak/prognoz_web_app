import { Component, Input } from '@angular/core';

import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-championship-rating-table',
    templateUrl: './championship-rating-table.component.html',
    styleUrls: ['./championship-rating-table.component.scss']
})
export class ChampionshipRatingTableComponent {
    @Input() rating: ChampionshipRating[];
    @Input() error: string;
    @Input() authenticatedUser: any;

    getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
    makeUnsigned = UtilsService.makeUnsigned;
}
