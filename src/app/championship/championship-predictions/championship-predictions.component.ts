import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { User } from '@models/user.model';
import { ChampionshipPredictionService } from '@services/championship/championship-prediction.service';
import { ChampionshipService } from '@services/championship/championship.service';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-championship-predictions',
   styleUrls: ['./championship-predictions.component.scss'],
   templateUrl: './championship-predictions.component.html'
})
export class ChampionshipPredictionsComponent implements OnInit {
   public authenticatedUser: User;
   public championshipMatches: ChampionshipMatchNew[];
   public championshipPredictionsForm: FormGroup;
   public errorChampionshipMatches: string;
   public spinnerButton = false;

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private championshipPredictionService: ChampionshipPredictionService,
      private championshipService: ChampionshipService,
      private currentStateService: CurrentStateService,
      private notificationsService: NotificationsService,
      private titleService: TitleService
   ) {}

   public ngOnInit(): void {
      this.titleService.setTitle('Зробити прогнози - Чемпіонат');
      this.authenticatedUser = this.currentStateService.getUser();
      this.championshipPredictionsForm = new FormGroup({});
      this.getChampionshipMatchesData();
   }

   public onSubmit(): void {
      this.spinnerButton = true;
      const championshipPredictionsToUpdate = this.championshipService.createChampionshipPredictionsArray(this.championshipPredictionsForm);
      this.championshipPredictionService.updateChampionshipPredictions(championshipPredictionsToUpdate).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Прогнози прийнято');
            this.getChampionshipMatchesData();
         },
         error => {
            this.spinnerButton = false;
            this.notificationsService.error('Помилка', error);
         }
      );
   }

   private getChampionshipMatchesData(): void {
      const search: ChampionshipMatchSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.championshipMatches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Ascending
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
