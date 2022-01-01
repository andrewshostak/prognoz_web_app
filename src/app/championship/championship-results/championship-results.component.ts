import { Component, OnInit } from '@angular/core';

import { CompetitionState } from '@enums/competition-state.enum';
import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-championship-results',
   styleUrls: ['./championship-results.component.scss'],
   templateUrl: './championship-results.component.html'
})
export class ChampionshipResultsComponent implements OnInit {
   public championshipMatches: ChampionshipMatchNew[];
   public error: string;

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private competitionService: CompetitionNewService,
      private titleService: TitleService
   ) {}

   public getActiveChampionshipCompetition(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         limit: 1,
         page: 1,
         states: [CompetitionState.Active],
         tournamentId: Tournament.Championship
      };

      return this.competitionService.getCompetitions(search);
   }

   public getEndedChampionshipMatches(competitionId: number): Observable<PaginatedResponse<ChampionshipMatchNew>> {
      const search: ChampionshipMatchSearch = {
         competitionId,
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'number_in_competition',
         page: 1,
         sequence: Sequence.Descending,
         states: [MatchState.Ended]
      };

      return this.championshipMatchService.getChampionshipMatches(search);
   }

   public ngOnInit(): void {
      this.titleService.setTitle('Результати матчів - Чемпіонат');

      this.getActiveChampionshipCompetition()
         .pipe(
            mergeMap(competitionResponse => {
               if (!competitionResponse.data[0]) {
                  return throwError('Активних змагань не знайдено');
               }
               return this.getEndedChampionshipMatches(competitionResponse.data[0].id);
            })
         )
         .subscribe(
            championshipMatchesResponse => {
               this.championshipMatches = championshipMatchesResponse.data;
            },
            error => {
               this.error = error;
            }
         );
   }
}
