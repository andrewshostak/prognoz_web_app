import { Component, OnInit } from '@angular/core';

import { UtilsService } from '@services/utils.service';
import { SettingsService } from '@services/settings.service';
import { iif, Observable, of } from 'rxjs';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipRating } from '@models/v2/championship/championship-rating.model';
import { ChampionshipRatingSearch } from '@models/search/championship/championship-rating-search.model';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipRatingService } from '@services/v2/championship/championship-rating.service';
import { Competition } from '@models/v2/competition.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionState } from '@enums/competition-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionService } from '@services/v2/competition.service';
import { mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-championship-rating-top',
   templateUrl: './championship-rating-top.component.html',
   styleUrls: ['./championship-rating-top.component.scss']
})
export class ChampionshipRatingTopComponent implements OnInit {
   constructor(private championshipRatingService: ChampionshipRatingService, private competitionService: CompetitionService) {}

   championshipRatingItems: ChampionshipRating[];
   errorRating: string;
   userDefaultImage: string = SettingsService.userDefaultImage;
   usersLogosPath: string = SettingsService.usersLogosPath + '/';
   getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;

   ngOnInit() {
      this.topRating();
   }

   topRating() {
      this.getActiveCompetitionObservable()
         .pipe(
            mergeMap(competitionsResponse =>
               iif(
                  () => !!competitionsResponse.total,
                  this.getChampionshipRatingObservable(competitionsResponse.data[0].id),
                  of({ data: [] })
               )
            )
         )
         .subscribe(response => (this.championshipRatingItems = response.data));
   }

   private getActiveCompetitionObservable(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: 1,
         states: [CompetitionState.Active],
         page: 1,
         tournamentId: Tournament.Championship
      };
      return this.competitionService.getCompetitions(search);
   }

   private getChampionshipRatingObservable(competitionId: number): Observable<PaginatedResponse<ChampionshipRating>> {
      const search: ChampionshipRatingSearch = {
         limit: 5,
         relations: ['user.mainClub'],
         competitionId,
         page: 1,
         orderBy: 'rating',
         sequence: Sequence.Descending
      };
      return this.championshipRatingService.getChampionshipRating(search);
   }
}
