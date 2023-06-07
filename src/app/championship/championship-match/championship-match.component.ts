import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatchNew } from '@models/v2/championship-match-new.model';
import { ChampionshipPredictionNew } from '@models/v2/championship-prediction-new.model';
import { ChampionshipPredictionSearch } from '@models/search/championship-prediction-search.model';
import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { ChampionshipPredictionNewService } from '@services/new/championship-prediction-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-match',
   styleUrls: ['./championship-match.component.scss'],
   templateUrl: './championship-match.component.html'
})
export class ChampionshipMatchComponent implements OnInit {
   public authenticatedUser: User;
   public championshipMatch: ChampionshipMatchNew;
   public championshipPredictions: ChampionshipPredictionNew[];
   public clubsLogosPath: string;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipMatchService: ChampionshipMatchNewService,
      private championshipPredictionService: ChampionshipPredictionNewService,
      private currentStateService: CurrentStateService,
      private location: Location,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.authenticatedUser = this.currentStateService.getUser();
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.activatedRoute.params.forEach((params: Params) => {
         this.getChampionshipMatchData(params.id);
         this.getChampionshipPredictionData(params.id);
      });
   }

   private getChampionshipMatchData(id: number): void {
      this.championshipMatchService.getChampionshipMatch(id).subscribe(response => {
         this.titleService.setTitle(`${response.match.club_home.title} vs
                        ${response.match.club_away.title}
                        ${response.match.started_at.slice(0, -3)} - Чемпіонат`);
         this.championshipMatch = response;
      });
   }

   private getChampionshipPredictionData(id: number): void {
      const search: ChampionshipPredictionSearch = {
         championshipMatchId: id,
         limit: SettingsService.maxLimitValues.championshipPredictions,
         orderBy: 'updated_at',
         page: 1,
         sequence: Sequence.Descending,
         userId: null
      };
      this.championshipPredictionService.getPredictionsByChampionshipMatchId(search).subscribe(response => {
         this.championshipPredictions = response.data;
      });
   }
}
