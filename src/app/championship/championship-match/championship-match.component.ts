import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipPrediction } from '@models/v2/championship/championship-prediction.model';
import { ChampionshipPredictionSearch } from '@models/search/championship/championship-prediction-search.model';
import { User } from '@models/v2/user.model';
import { AuthNewService } from '@services/v2/auth-new.service';
import { ChampionshipMatchNewService } from '@services/v2/championship-match-new.service';
import { ChampionshipPredictionNewService } from '@services/v2/championship-prediction-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';

@Component({
   selector: 'app-championship-match',
   styleUrls: ['./championship-match.component.scss'],
   templateUrl: './championship-match.component.html'
})
export class ChampionshipMatchComponent implements OnInit {
   public authenticatedUser: User;
   public championshipMatch: ChampionshipMatch;
   public championshipPredictions: ChampionshipPrediction[];
   public clubsLogosPath: string;

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private championshipMatchService: ChampionshipMatchNewService,
      private championshipPredictionService: ChampionshipPredictionNewService,
      private location: Location,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.authenticatedUser = this.authService.getUser();
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
