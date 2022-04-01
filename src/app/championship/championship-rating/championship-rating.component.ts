import { Component, OnInit } from '@angular/core';

import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { TitleService } from '@services/title.service';
import { get } from 'lodash';
import { iif, Observable, of } from 'rxjs';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionState } from '@enums/competition-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { ChampionshipRatingNew } from '@models/new/championship-rating-new.model';
import { ChampionshipRatingSearch } from '@models/search/championship-rating-search.model';
import { SettingsService } from '@services/settings.service';
import { ChampionshipRatingNewService } from '@services/new/championship-rating-new.service';
import { mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-championship-rating',
   templateUrl: './championship-rating.component.html',
   styleUrls: ['./championship-rating.component.scss']
})
export class ChampionshipRatingComponent implements OnInit {
   public authenticatedUser: User;
   public championshipRatingItems: ChampionshipRatingNew[];
   public ratingUpdatedAt: string;

   constructor(
      private championshipRatingService: ChampionshipRatingNewService,
      private championshipMatchService: ChampionshipMatchNewService,
      private competitionService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Рейтинг гравців - Чемпіонат');
      this.authenticatedUser = this.currentStateService.getUser();
      this.getLastMatchData();
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

   private getActiveCompetitionObservable(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         limit: 1,
         states: [CompetitionState.Active],
         page: 1,
         tournamentId: Tournament.Championship
      };
      return this.competitionService.getCompetitions(search);
   }

   private getChampionshipRatingObservable(competitionId: number): Observable<PaginatedResponse<ChampionshipRatingNew>> {
      const search: ChampionshipRatingSearch = {
         limit: SettingsService.maxLimitValues.championshipRating,
         relations: ['user.mainClub'],
         competitionId,
         page: 1,
         orderBy: 'rating',
         sequence: Sequence.Descending
      };
      return this.championshipRatingService.getChampionshipRating(search);
   }

   private getLastMatchData(): void {
      const search: ChampionshipMatchSearch = {
         orderBy: 'updated_at',
         limit: 1,
         page: 1,
         sequence: Sequence.Descending,
         states: [MatchState.Ended]
      };
      this.championshipMatchService.getChampionshipMatches(search).subscribe(response => {
         this.ratingUpdatedAt = get(response, 'data[0].updated_at', null);
      });
   }
}
