import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CupRatingCalculated } from '@models/v2/cup/cup-rating-calculated.model';
import { CupRatingSearch } from '@models/search/cup/cup-rating-search.model';
import { CupRatingService } from '@services/api/v2/cup/cup-rating.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-cup-rating-user',
   templateUrl: './cup-rating-user.component.html',
   styleUrls: ['./cup-rating-user.component.scss']
})
export class CupRatingUserComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private cupRatingService: CupRatingService,
      private router: Router,
      private titleService: TitleService
   ) {}

   cupRating: CupRatingCalculated;

   ngOnInit() {
      const search: CupRatingSearch = { userId: this.activatedRoute.snapshot.params.userId, relations: ['user.clubs'] };
      this.cupRatingService.getCupRating(search).subscribe(response => {
         if (!response.data.length) {
            this.router.navigate(['/404']);
            return;
         }
         this.titleService.setTitle(`Рейтинг ${response.data[0].user.name} - Кубок`);
         this.cupRating = response.data[0];
      });
   }
}
