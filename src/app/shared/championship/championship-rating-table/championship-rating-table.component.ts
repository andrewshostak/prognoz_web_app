import { Component, Input }   from '@angular/core';

import { ChampionshipRating } from '../../models/championship-rating.model';
import { environment }        from '../../../../environments/environment';
import { HelperService }      from '../../../core/helper.service';

@Component({
  selector: 'app-championship-rating-table',
  templateUrl: './championship-rating-table.component.html',
  styleUrls: ['./championship-rating-table.component.css']
})
export class ChampionshipRatingTableComponent {

    @Input() rating: ChampionshipRating[];
    @Input() error: string;
    @Input() authenticatedUser: any;

    clubsImagesUrl: string = environment.apiImageClubs;

    constructor(
        public helperService: HelperService
    ) { }
}
