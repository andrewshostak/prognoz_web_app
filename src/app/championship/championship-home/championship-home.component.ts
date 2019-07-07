import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { environment } from '@env';
import { ChampionshipPrediction } from '@models/championship/championship-prediction.model';
import { ChampionshipRating } from '@models/championship/championship-rating.model';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { User } from '@models/user.model';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipRatingService } from '@services/championship/championship-rating.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-championship-home',
   styleUrls: ['./championship-home.component.scss'],
   templateUrl: './championship-home.component.html'
})
export class ChampionshipHomeComponent implements OnInit {
   public authenticatedUser: User;
   public championshipMatches: ChampionshipMatchNew[];
   public championshipPredictions: ChampionshipPrediction[];
   public championshipPredictionsForm: FormGroup;
   public championshipRatingItems: ChampionshipRating[];
   public clubsImagesUrl: string = environment.apiImageClubs;
   public errorChampionshipMatches: string;
   public errorChampionshipPredictions: string;
   public errorChampionshipRating: string;
   public getHomeCityInBrackets = UtilsService.getHomeCityInBrackets;
   public spinnerButton = false;
   public userImageDefault: string = environment.imageUserDefault;
   public userImagesUrl: string = environment.apiImageUsers;

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private championshipPredictionService: ChampionshipPredictionService,
      private championshipService: ChampionshipService,
      private championshipRatingService: ChampionshipRatingService,
      private currentStateService: CurrentStateService,
      private notificationsService: NotificationsService,
      private titleService: TitleService
   ) {}

   public getChampionshipMatchesData(): void {
      const search: ChampionshipMatchSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Ascending,
         soon: ModelStatus.Truthy
      };

      if (this.authenticatedUser) {
         search.userId = this.authenticatedUser.id;
      }

      this.championshipMatchService.getChampionshipMatches(search).subscribe(
         response => {
            this.updateForm(response.data, !!this.authenticatedUser);
         },
         error => {
            this.errorChampionshipMatches = error;
         }
      );
   }

   public getChampionshipPredictionsData(): void {
      const param = [{ parameter: 'distinct', value: 'true' }];
      this.championshipPredictionService.getChampionshipPredictions(param).subscribe(
         response => {
            if (response) {
               this.championshipPredictions = response.championship_predicts;
            }
         },
         error => {
            this.errorChampionshipPredictions = error;
         }
      );
   }

   public getChampionshipRatingData(): void {
      const param = [{ parameter: 'limit', value: '5' }];
      this.championshipRatingService.getChampionshipRatingItems(param).subscribe(
         response => {
            if (response) {
               this.championshipRatingItems = response.championship_ratings;
            }
         },
         error => {
            this.errorChampionshipRating = error;
         }
      );
   }

   public ngOnInit(): void {
      this.titleService.setTitle('Найближчі матчі, останні прогнози і топ-рейтингу - Чемпіонат');
      this.authenticatedUser = this.currentStateService.getUser();
      this.championshipPredictionsForm = new FormGroup({});
      this.getChampionshipMatchesData();
      this.getChampionshipRatingData();
      this.getChampionshipPredictionsData();
   }

   public onSubmit(): void {
      this.spinnerButton = true;
      const championshipPredictionsToUpdate = this.championshipService.createChampionshipPredictionsArray(this.championshipPredictionsForm);
      this.championshipPredictionService.updateChampionshipPredictions(championshipPredictionsToUpdate).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Прогнози прийнято');
            this.getChampionshipMatchesData();
            this.getChampionshipPredictionsData();
         },
         error => {
            this.spinnerButton = false;
            this.notificationsService.error('Помилка', error);
         }
      );
   }

   private updateForm(championshipMatches: ChampionshipMatchNew[], isAuthenticatedUser: boolean): void {
      this.championshipMatches = championshipMatches;
      if (isAuthenticatedUser) {
         this.championshipPredictionsForm = new FormGroup({});
         for (const championshipMatch of this.championshipMatches) {
            const home = championshipMatch.championship_predicts.length ? championshipMatch.championship_predicts[0].home : null;
            const away = championshipMatch.championship_predicts.length ? championshipMatch.championship_predicts[0].away : null;
            this.championshipPredictionsForm.addControl(championshipMatch.id + '_home', new FormControl(home));
            this.championshipPredictionsForm.addControl(championshipMatch.id + '_away', new FormControl(away));
         }
      } else {
         for (const championshipMatch of this.championshipMatches) {
            this.championshipPredictionsForm.removeControl(championshipMatch.id + '_home');
            this.championshipPredictionsForm.removeControl(championshipMatch.id + '_away');
         }
      }
   }
}
