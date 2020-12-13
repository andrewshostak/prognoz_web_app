import { Component, OnInit } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { CupRating } from '@models/cup/cup-rating.model';
import { SeasonNew } from '@models/new/season-new.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { User } from '@models/user.model';
import { CupRatingService } from '@services/cup/cup-rating.service';
import { CurrentStateService } from '@services/current-state.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-cup-rating',
   templateUrl: './cup-rating.component.html',
   styleUrls: ['./cup-rating.component.scss']
})
export class CupRatingComponent implements OnInit {
   public authenticatedUser: User;
   public cupRating: CupRating[];
   public seasons: SeasonNew[];
   public errorCupRating: string;

   constructor(
      private cupRatingService: CupRatingService,
      private currentStateService: CurrentStateService,
      private seasonService: SeasonNewService,
      private titleService: TitleService
   ) {}

   public ngOnInit() {
      this.authenticatedUser = this.currentStateService.getUser();
      this.titleService.setTitle('Рейтинг гравців - Кубок');
      this.authenticatedUser = this.currentStateService.getUser();
      this.cupRatingService.getCupRating().subscribe(
         response => {
            this.cupRating = response.map(cupRatingItem => {
               cupRatingItem.before_previous_season_points = parseFloat(cupRatingItem.before_previous_season_points.toFixed(3));
               cupRatingItem.previous_season_points = parseFloat(cupRatingItem.previous_season_points.toFixed(3));
               cupRatingItem.active_season_points = parseFloat(cupRatingItem.active_season_points.toFixed(3));
               cupRatingItem.points_summary = parseFloat(cupRatingItem.points_summary.toFixed(3));
               return cupRatingItem;
            });
         },
         error => {
            this.errorCupRating = error;
         }
      );
      const search: SeasonSearch = { page: 1, limit: SettingsService.maxLimitValues.seasons, orderBy: 'id', sequence: Sequence.Descending };
      this.seasonService.getSeasons(search).subscribe(response => {
         this.seasons = response.data;
      });
   }
}
