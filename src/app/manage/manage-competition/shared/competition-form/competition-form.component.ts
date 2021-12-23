import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CompetitionState } from '@enums/competition-state.enum';
import { SeasonState } from '@enums/season-state.enum';
import { Competition } from '@models/competition.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { SeasonNew } from '@models/new/season-new.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { Tournament } from '@models/tournament.model';
import { CompetitionService } from '@services/competition.service';
import { FormValidatorService } from '@services/form-validator.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { SettingsService } from '@services/settings.service';
import { TournamentService } from '@services/tournament.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-competition-form',
   templateUrl: './competition-form.component.html',
   styleUrls: ['./competition-form.component.scss']
})
export class CompetitionFormComponent implements OnChanges, OnInit {
   @Input() public competition: Competition | CompetitionNew;

   public competitionForm: FormGroup;
   public errorTournaments: string;
   public seasons: SeasonNew[];
   public tournaments: Tournament[];

   constructor(
      private competitionService: CompetitionService,
      private location: Location,
      private notificationsService: NotificationsService,
      private seasonService: SeasonNewService,
      private tournamentService: TournamentService,
      private formValidatorService: FormValidatorService
   ) {}

   public createCompetition(competition: Competition): void {
      this.competitionService.createCompetition(competition).subscribe(
         response => {
            this.notificationsService.success('Успішно', 'Змагання створено');
            this.location.back();
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.competitionForm, 'competition', (formGroup, field, value) => {
         if (['stated', 'active', 'ended'].includes(field)) {
            return;
         }

         if (field === 'state') {
            switch (value) {
               case CompetitionState.Applications:
                  formGroup.get('stated').setValue(true);
                  break;
               case CompetitionState.Active:
                  formGroup.get('active').setValue(true);
                  break;
               case CompetitionState.Ended:
                  formGroup.get('ended').setValue(true);
                  break;
            }
         } else {
            if (formGroup.get(field)) {
               formGroup.patchValue({ [field]: value });
            }
         }
      });
   }

   public ngOnInit() {
      this.getSeasonsData();
      this.getTournamentsData();
      this.competitionForm = new FormGroup({
         title: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]),
         season_id: new FormControl('', [Validators.required]),
         tournament_id: new FormControl('', [Validators.required]),
         stated: new FormControl(false),
         active: new FormControl(false),
         ended: new FormControl(false),
         participants: new FormControl(null, [this.formValidatorService.parity()]),
         players_in_group: new FormControl(null, [this.formValidatorService.parity()]),
         first_playoff_stage: new FormControl(null, [this.formValidatorService.parity()]),
         number_of_teams: new FormControl(null, [this.formValidatorService.parity()])
      });
   }

   public onSubmit(): void {
      if (this.competitionForm.valid) {
         this.competition ? this.updateCompetition(this.competitionForm.value) : this.createCompetition(this.competitionForm.value);
      }
   }

   public updateCompetition(competition: Competition): void {
      this.competitionService.updateCompetition(competition, this.competition.id).subscribe(
         response => {
            this.notificationsService.success('Успішно', 'Змагання змінено');
            this.location.back();
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }

   private getSeasonsData() {
      const search: SeasonSearch = {
         limit: SettingsService.maxLimitValues.seasons,
         page: 1,
         state: SeasonState.Active
      };
      this.seasonService.getSeasons(search).subscribe(response => (this.seasons = response.data));
   }

   private getTournamentsData() {
      this.tournamentService.getTournaments().subscribe(
         response => {
            if (response) {
               this.tournaments = response.tournaments;
            }
         },
         error => {
            this.errorTournaments = error;
         }
      );
   }
}
