import { Component, OnInit } from '@angular/core';

import { CupRatingCalculatedNew } from '@models/new/cup-rating-calculated-new.model';
import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { CupRatingNewService } from '@services/new/cup-rating-new.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-cup-rating',
   templateUrl: './cup-rating.component.html',
   styleUrls: ['./cup-rating.component.scss']
})
export class CupRatingComponent implements OnInit {
   public authenticatedUser: User;
   public cupRating: CupRatingCalculatedNew[];

   constructor(
      private cupRatingService: CupRatingNewService,
      private currentStateService: CurrentStateService,
      private titleService: TitleService
   ) {}

   public ngOnInit() {
      this.titleService.setTitle('Рейтинг гравців - Кубок');
      this.authenticatedUser = this.currentStateService.getUser();
      this.getCupRatingData();
   }

   private getCupRatingData(): void {
      this.cupRatingService.getCupRating({}).subscribe(response => (this.cupRating = response.data));
   }
}
