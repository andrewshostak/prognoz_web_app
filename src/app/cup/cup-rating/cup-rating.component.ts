import { Component, OnInit } from '@angular/core';

import { CupRatingCalculated } from '@models/v2/cup/cup-rating-calculated.model';
import { User } from '@models/v2/user.model';
import { CupRatingService } from '@services/api/v2/cup/cup-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-cup-rating',
   templateUrl: './cup-rating.component.html',
   styleUrls: ['./cup-rating.component.scss']
})
export class CupRatingComponent implements OnInit {
   public authenticatedUser: User;
   public cupRating: CupRatingCalculated[];

   constructor(
      private currentStateService: CurrentStateService,
      private cupRatingService: CupRatingService,
      private titleService: TitleService
   ) {}

   public ngOnInit() {
      this.titleService.setTitle('Рейтинг гравців - Кубок');
      this.authenticatedUser = this.currentStateService.getUser();
      this.getCupRatingData();
   }

   private getCupRatingData(): void {
      this.cupRatingService.getCupRating({ relations: ['user.mainClub'] }).subscribe(response => (this.cupRating = response.data));
   }
}
