import { Component, OnInit } from '@angular/core';

import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { UtilsService } from '@services/utils.service';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-championship-rating-top',
   templateUrl: './championship-rating-top.component.html',
   styleUrls: ['./championship-rating-top.component.scss']
})
export class ChampionshipRatingTopComponent implements OnInit {
   constructor(private championshipRatingService: ChampionshipRatingService) {}

   championshipRatingItems: ChampionshipRating[];
   errorRating: string;
   userDefaultImage: string = SettingsService.userDefaultImage;
   usersLogosPath: string = SettingsService.usersLogosPath + '/';
   getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;

   ngOnInit() {
      this.topRating();
   }

   topRating() {
      const param = [{ parameter: 'limit', value: '5' }];
      this.championshipRatingService.getChampionshipRatingItems(param).subscribe(
         response => {
            if (response) {
               this.championshipRatingItems = response.championship_ratings;
            }
         },
         error => {
            this.errorRating = error;
         }
      );
   }
}
