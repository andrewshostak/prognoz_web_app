import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-competition-results',
   styleUrls: ['./championship-competition-results.component.scss'],
   templateUrl: './championship-competition-results.component.html'
})
export class ChampionshipCompetitionResultsComponent implements OnInit {
   public championshipMatches: ChampionshipMatch[];
   public errorChampionshipMatches: string;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipMatchService: ChampionshipMatchNewService,
      private titleService: TitleService
   ) {}

   public getEndedChampionshipMatchesData(competitionId: number): void {
      const search: ChampionshipMatchSearch = {
         competitionId,
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'number_in_competition',
         page: 1,
         sequence: Sequence.Descending,
         states: [MatchState.Ended]
      };

      this.championshipMatchService.getChampionshipMatches(search).subscribe(
         response => {
            this.resetChampionshipMatchesData();
            this.championshipMatches = response.data;
         },
         error => {
            this.resetChampionshipMatchesData();
            this.errorChampionshipMatches = error;
         }
      );
   }

   public ngOnInit(): void {
      this.activatedRoute.params.forEach((params: Params) => {
         this.titleService.setTitle(`Результати матчів в конкурсі ${params.competitionId} - Чемпіонат`);
         this.getEndedChampionshipMatchesData(params.competitionId);
      });
   }

   private resetChampionshipMatchesData(): void {
      this.championshipMatches = null;
      this.errorChampionshipMatches = null;
   }
}
