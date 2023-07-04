import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { User } from '@models/v2/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { ChampionshipPredictionService } from '@services/api/v2/championship/championship-prediction.service';
import { ChampionshipCompetitionService } from '@services/championship-competition.service';
import { ChampionshipMatchService } from '@services/api/v2/championship/championship-match.service';
import { PaginationService } from '@services/pagination.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-championship-predictions',
   styleUrls: ['./championship-predictions.component.scss'],
   templateUrl: './championship-predictions.component.html'
})
export class ChampionshipPredictionsComponent implements OnInit {
   public authenticatedUser: User;
   public championshipMatches: ChampionshipMatch[];
   public championshipPredictionsForm: FormGroup;
   public errorChampionshipMatches: string;
   public spinnerButton = false;

   constructor(
      private championshipMatchService: ChampionshipMatchService,
      private championshipPredictionService: ChampionshipPredictionService,
      private championshipService: ChampionshipCompetitionService,
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
      this.championshipPredictionService.upsertPredictions(championshipPredictionsToUpdate).subscribe(
         () => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Прогнози прийнято');
            this.getChampionshipMatchesData();
         },
         () => (this.spinnerButton = false)
      );
   }

   private getChampionshipMatchesData(): void {
      const search: ChampionshipMatchSearch = {
         limit: PaginationService.limit.championshipMatches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Ascending,
         states: [MatchState.Active]
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

   private updateForm(championshipMatches: ChampionshipMatch[], isAuthenticatedUser: boolean): void {
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
