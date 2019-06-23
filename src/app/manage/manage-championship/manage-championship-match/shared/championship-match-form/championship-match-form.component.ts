import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { ChampionshipMatchNew } from '@models/championship/championship-match-new.model';
import { Match } from '@models/match.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { MatchSearch } from '@models/search/match-search.model';
import { ChampionshipMatchNewService } from '@services/championship/championship-match-new.service';
import { MatchService } from '@services/match.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-championship-match-form',
   styleUrls: ['./championship-match-form.component.scss'],
   templateUrl: './championship-match-form.component.html'
})
export class ChampionshipMatchFormComponent implements OnChanges, OnInit {
   @Input() public championshipMatch: ChampionshipMatchNew;

   public championshipMatchForm: FormGroup;
   public clubsLogosPath: string;
   public competitions: CompetitionNew[];
   public matches: Match[];

   constructor(
      private championshipMatchService: ChampionshipMatchNewService,
      private competitionService: CompetitionNewService,
      private matchService: MatchService,
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
            `Матч №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} створено`
         );
         this.championshipMatchForm.get('match_id').reset();
      });
   }

   public getCompetitionsData(): void {
      const competitionSearch: CompetitionSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.competitions,
         tournamentId: Tournament.Championship
      };
      this.competitionService.getCompetitions(competitionSearch).subscribe(response => {
         this.competitions = response.data;
      });
   }

   public getMatches(): void {
      const matchSearch: MatchSearch = {
         ended: ModelStatus.Falsy,
         limit: SettingsService.maxLimitValues.matches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Descending
      };
      this.matchService.getMatches(matchSearch).subscribe(response => {
         this.matches = response.data;
      });
   }

   public matchesFilter(term: string, match: Match): boolean {
      const title = term.toLocaleLowerCase();
      return match.club_home.title.toLocaleLowerCase().indexOf(title) > -1 || match.club_away.title.toLocaleLowerCase().indexOf(title) > -1;
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (!changes.championshipMatch.firstChange) {
         this.addNumberInCompetitionFormControl();
      }
      UtilsService.patchSimpleChangeValuesInForm(changes, this.championshipMatchForm, 'championshipMatch');
      if (!changes.championshipMatch.firstChange && changes.championshipMatch.currentValue.match.ended) {
         this.matches = [changes.championshipMatch.currentValue.match];
         this.competitions = [changes.championshipMatch.currentValue.competition];
         this.championshipMatchForm.disable();
      }
   }

   public ngOnInit(): void {
      this.getCompetitionsData();
      this.getMatches();
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.championshipMatchForm = new FormGroup({
         competition_id: new FormControl(null, [Validators.required]),
         match_id: new FormControl(null, [Validators.required])
      });
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
      const toUpdate: Partial<ChampionshipMatchNew> = championshipMatch;
      toUpdate.id = this.championshipMatch.id;

      this.championshipMatchService.updateChampionshipMatch(toUpdate).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
