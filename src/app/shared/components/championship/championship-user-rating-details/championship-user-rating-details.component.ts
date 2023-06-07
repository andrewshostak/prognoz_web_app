import { Component, Input } from '@angular/core';

import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { User } from '@models/v1/user.model';

@Component({
   selector: 'app-championship-user-rating-details',
   templateUrl: './championship-user-rating-details.component.html',
   styleUrls: ['./championship-user-rating-details.component.scss']
})
export class ChampionshipUserRatingDetailsComponent {
   @Input() championshipRatingItem: ChampionshipRating;
   @Input() user: User;
}
