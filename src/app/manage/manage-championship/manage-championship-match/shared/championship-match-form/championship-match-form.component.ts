import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-championship-match-form',
   styleUrls: ['./championship-match-form.component.scss'],
   templateUrl: './championship-match-form.component.html'
})
export class ChampionshipMatchFormComponent implements OnChanges, OnInit {
   @Input() public championshipMatch: ChampionshipMatchNew;

   public championshipMatchForm: FormGroup;
   public championshipMatchesObservable: Observable<PaginatedResponse<ChampionshipMatchNew>>;
   public competitions: CompetitionNew[];
   public lastCreatedMatchId: number;

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService
   ) {}

   public addNumberInCompetitionFormControl(): void {
      this.championshipMatchForm.addControl(
         'number_in_competition',
         new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)])
      );
   }

   public createChampionshipMatch(championshipMatch: Partial<ChampionshipMatchNew>): void {
      this.championshipMatchService.createChampionshipMatch(championshipMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч чемпіонату №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} створено`
         );
         this.championshipMatchForm.get('match_id').reset();
         this.lastCreatedMatchId = response.match_id;
      });
   }

   public getCompetitionsData(): void {
      const competitionSearch: CompetitionSearch = {
         ended: ModelStatus.Falsy,
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         tournamentId: Tournament.Championship
      };
      this.competitionService.getCompetitions(competitionSearch).subscribe(response => {
         this.competitions = response.data;
      });
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (!changes.championshipMatch.firstChange) {
         this.addNumberInCompetitionFormControl();
      }
      UtilsService.patchSimpleChangeValuesInForm(changes, this.championshipMatchForm, 'championshipMatch');
      if (!changes.championshipMatch.firstChange && changes.championshipMatch.currentValue.match.ended) {
         this.competitions = [changes.championshipMatch.currentValue.competition];
         this.championshipMatchForm.disable();
      }
   }

   public ngOnInit(): void {
      this.setChampionshipMatchesObservable();
      this.getCompetitionsData();
      this.championshipMatchForm = new FormGroup({
         competition_id: new FormControl(null, [Validators.required]),
         match_id: new FormControl(null, [Validators.required])
      });
   }

   public setChampionshipMatchesObservable(): void {
      const search: ChampionshipMatchSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.championshipMatches,
         page: 1
      };
      this.championshipMatchesObservable = this.championshipMatchService.getChampionshipMatches(search);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public submitted(): void {
      if (this.championshipMatchForm.invalid) {
         return;
      }

      this.championshipMatch
         ? this.updateChampionshipMatch(this.championshipMatchForm.value)
         : this.createChampionshipMatch(this.championshipMatchForm.value);
   }

   public updateChampionshipMatch(championshipMatch: Partial<ChampionshipMatchNew>): void {
      this.championshipMatchService.updateChampionshipMatch(this.championshipMatch.id, championshipMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч чемпіонату №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
