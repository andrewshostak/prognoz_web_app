import { Component, OnInit } from '@angular/core';

import { CompetitionState } from '@enums/competition-state.enum';
import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { Competition } from '@models/v2/competition.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { ChampionshipMatchService } from '@services/v2/championship/championship-match.service';
import { CompetitionService } from '@services/v2/competition.service';
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
   public championshipMatches: ChampionshipMatch[];
   public error: string;

   constructor(
      private championshipMatchService: ChampionshipMatchService,
      private competitionService: CompetitionService,
      private titleService: TitleService
   ) {}

   public getActiveChampionshipCompetition(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: 1,
         page: 1,
         states: [CompetitionState.Active],
         tournamentId: Tournament.Championship
      };

      return this.competitionService.getCompetitions(search);
   }

   public getEndedChampionshipMatches(competitionId: number): Observable<PaginatedResponse<ChampionshipMatch>> {
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
