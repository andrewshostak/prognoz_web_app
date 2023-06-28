import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { Competition } from '@models/v2/competition.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { ChampionshipMatchService } from '@services/v2/championship/championship-match.service';
import { CompetitionService } from '@services/v2/competition.service';
import { PaginationService } from '@services/pagination.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-championship-match-form',
   styleUrls: ['./championship-match-form.component.scss'],
   templateUrl: './championship-match-form.component.html'
})
export class ChampionshipMatchFormComponent implements OnChanges, OnInit {
   @Input() public championshipMatch: ChampionshipMatch;

   public championshipMatchForm: FormGroup;
   public championshipMatchesObservable: Observable<PaginatedResponse<ChampionshipMatch>>;
   public competitions: Competition[];
   public lastCreatedMatchId: number;

   constructor(
      private championshipMatchService: ChampionshipMatchService,
      private competitionService: CompetitionService,
      private notificationsService: NotificationsService
   ) {}

   public addNumberInCompetitionFormControl(): void {
      this.championshipMatchForm.addControl(
         'number_in_competition',
         new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)])
      );
   }

   public createChampionshipMatch(championshipMatch: Partial<ChampionshipMatch>): void {
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
         limit: PaginationService.limit.competitions,
         page: 1,
         states: [CompetitionState.NotStarted, CompetitionState.Active],
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
      if (!changes.championshipMatch.firstChange && changes.championshipMatch.currentValue.match.state === MatchState.Ended) {
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
         limit: PaginationService.limit.championshipMatches,
         page: 1,
         states: [MatchState.Active]
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

   public updateChampionshipMatch(championshipMatch: Partial<ChampionshipMatch>): void {
      this.championshipMatchService.updateChampionshipMatch(this.championshipMatch.id, championshipMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч чемпіонату №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
