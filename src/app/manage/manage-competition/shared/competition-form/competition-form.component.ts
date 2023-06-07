import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { CompetitionState } from '@enums/competition-state.enum';
import { SeasonState } from '@enums/season-state.enum';
import { CompetitionNew } from '@models/v2/competition-new.model';
import { SeasonNew } from '@models/v2/season-new.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { TournamentNew } from '@models/v2/tournament-new.model';
import { FormValidatorService } from '@services/form-validator.service';
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
      private tournamentService: TournamentNewService,
      private formValidatorService: FormValidatorService
   ) {}

   public createCompetition(competition: Partial<CompetitionNew>): void {
      this.competitionService.createCompetition(competition).subscribe(response => {
         this.notificationsService.success('Успішно', `Змагання ${response.title} створено`);
         this.location.back();
      });
   }

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.competitionForm, 'competition', (formGroup, field, value) => {
         if (field === 'config') {
            formGroup.get('config').setValue(JSON.stringify(value));
            return;
         }

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
         config: new FormControl(null, [Validators.required, this.formValidatorService.json()])
      });
   }

   public onSubmit(): void {
      if (this.competitionForm.valid) {
         const competition: Partial<CompetitionNew> = { ...this.competitionForm.value };
         competition.config = JSON.parse(this.competitionForm.get('config').value);
         this.competition ? this.updateCompetition(competition) : this.createCompetition(competition);
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
