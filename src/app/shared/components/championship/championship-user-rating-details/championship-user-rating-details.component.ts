import { Component, Input } from '@angular/core';

import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { User } from '@models/user.model';
import { ChampionshipRatingNew } from '@models/new/championship-rating-new.model';

@Component({
   selector: 'app-championship-user-rating-details',
   templateUrl: './championship-user-rating-details.component.html',
   styleUrls: ['./championship-user-rating-details.component.scss']
})
export class ChampionshipUserRatingDetailsComponent {
   @Input() championshipRatingItem: ChampionshipRating | ChampionshipRatingNew;
   @Input() errorUser: string;
   @Input() errorChampionshipRating: string;
   @Input() user: User;
}
