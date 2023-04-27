import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { CompetitionState } from '@enums/competition-state.enum';
import { SeasonState } from '@enums/season-state.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { SeasonNew } from '@models/new/season-new.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { TournamentNew } from '@models/new/tournament-new.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { SettingsService } from '@services/settings.service';
import { TournamentNewService } from '@services/new/tournament-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-competition-form',
   templateUrl: './competition-form.component.html',
   styleUrls: ['./competition-form.component.scss']
})
export class CompetitionFormComponent implements OnChanges, OnInit {
   @Input() public competition: CompetitionNew;

   public competitionForm: FormGroup;
   public seasons: SeasonNew[];
   public tournaments: TournamentNew[];
   competitionStates = CompetitionState;

   constructor(
      private competitionService: CompetitionNewService,
      private location: Location,
      private notificationsService: NotificationsService,
      private seasonService: SeasonNewService,
      private tournamentService: TournamentNewService
   ) {}

   public createCompetition(competition: Partial<CompetitionNew>): void {
      this.competitionService.createCompetition(competition).subscribe(response => {
         this.notificationsService.success('Успішно', `Змагання ${response.title} створено`);
         this.location.back();
      });
   }

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.competitionForm, 'competition', (formGroup, field, value) => {
         if (formGroup.get(field)) {
            formGroup.patchValue({ [field]: value });
         }
      });

      if (!simpleChanges.competition.firstChange && simpleChanges.competition.currentValue.state === CompetitionState.Ended) {
         this.competitionForm.disable();
      }
   }

   public ngOnInit() {
      this.getSeasonsData();
      this.getTournamentsData();
      this.competitionForm = new FormGroup({
         title: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
         season_id: new FormControl(null, [Validators.required]),
         tournament_id: new FormControl(null, [Validators.required]),
         number_in_season: new FormControl(null, [Validators.required]),
         state: new FormControl(CompetitionState.NotStarted, [Validators.required]),
         config: new FormControl(null, [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.competitionForm.valid) {
         this.competition ? this.updateCompetition(this.competitionForm.value) : this.createCompetition(this.competitionForm.value);
      }
   }

   public updateCompetition(competition: Partial<CompetitionNew>): void {
      this.competitionService.updateCompetition(this.competition.id, competition).subscribe(response => {
         this.notificationsService.success('Успішно', `Змагання ${response.title} змінено`);
         this.location.back();
      });
   }

   showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getSeasonsData() {
      const search: SeasonSearch = {
         limit: SettingsService.maxLimitValues.seasons,
         page: 1,
         states: [SeasonState.Active]
      };
      this.seasonService.getSeasons(search).subscribe(response => (this.seasons = response.data));
   }

   private getTournamentsData() {
      this.tournamentService.getTournaments().subscribe(response => (this.tournaments = response));
   }
}
