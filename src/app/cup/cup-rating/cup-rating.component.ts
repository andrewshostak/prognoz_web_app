import { Component, OnInit } from '@angular/core';

import { CupRatingCalculated } from '@models/v2/cup/cup-rating-calculated.model';
import { User } from '@models/v2/user.model';
import { AuthNewService } from '@services/v2/auth-new.service';
import { CupRatingNewService } from '@services/v2/cup-rating-new.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-cup-rating',
   templateUrl: './cup-rating.component.html',
   styleUrls: ['./cup-rating.component.scss']
})
export class CupRatingComponent implements OnInit {
   public authenticatedUser: User;
   public cupRating: CupRatingCalculated[];

   constructor(private authService: AuthNewService, private cupRatingService: CupRatingNewService, private titleService: TitleService) {}

   public ngOnInit() {
      this.titleService.setTitle('Рейтинг гравців - Кубок');
      this.authenticatedUser = this.authService.getUser();
      this.getCupRatingData();
   }

   private getCupRatingData(): void {
      this.cupRatingService.getCupRating({ relations: ['user.mainClub'] }).subscribe(response => (this.cupRating = response.data));
   }
}
