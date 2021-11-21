import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-team-stages-generation-modal',
   templateUrl: './team-stages-generation-modal.component.html',
   styleUrls: ['./team-stages-generation-modal.component.scss']
})
export class TeamStagesGenerationModalComponent implements OnInit {
   @Input() public close: () => void;
   @Output() public successfullySubmitted = new EventEmitter<void>();

   public generationForm: FormGroup;
   public competitions: CompetitionNew[] = [];
   public spinnerButton = false;

   constructor(
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService,
      private teamStageService: TeamStageNewService
   ) {}

   public ngOnInit(): void {
      this.getCompetitionsData();
      this.generationForm = new FormGroup({
         competition_id: new FormControl(null, [Validators.required]),
         from: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(100)]),
         to: new FormControl(null, [Validators.required, Validators.min(2), Validators.max(100)])
      });
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         ended: ModelStatus.Falsy,
         tournamentId: Tournament.Team,
         orderBy: 'number_in_season',
         sequence: Sequence.Descending
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = response.data;
      });
   }

   public submit(): void {
      if (this.generationForm.invalid) {
         return;
      }

      this.spinnerButton = true;
      this.teamStageService.generateTeamStages(this.generationForm.value).subscribe(
         response => {
            this.spinnerButton = false;
            this.notificationsService.success('Успішно', 'Кількість створених стадій: ' + response);
            this.successfullySubmitted.emit();
         },
         () => (this.spinnerButton = false)
      );
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }
}
