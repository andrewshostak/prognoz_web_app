import { Component, Input } from '@angular/core';

import { ChampionshipRatingNew } from '@models/new/championship-rating-new.model';
import { User } from '@models/user.model';

@Component({
   selector: 'app-championship-user-rating-details',
   templateUrl: './championship-user-rating-details.component.html',
   styleUrls: ['./championship-user-rating-details.component.scss']
})
export class ChampionshipUserRatingDetailsComponent {
   @Input() championshipRatingItem: ChampionshipRatingNew;
   @Input() user: User;
}
