import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { TeamMatch } from '@models/v2/team/team-match.model';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { OpenedModal } from '@models/opened-modal.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamMatchSearch } from '@models/search/team/team-match-search.model';
import { TeamStageSearch } from '@models/search/team/team-stage-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TeamMatchNewService } from '@services/v2/team-match-new.service';
import { TeamStageNewService } from '@services/v2/team-stage-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-team-match-form',
   styleUrls: ['./team-match-form.component.scss'],
   templateUrl: './team-match-form.component.html'
})
export class TeamMatchFormComponent implements OnChanges, OnInit {
   @Input() public teamMatch: TeamMatch;

   public teamStages: TeamStage[];
   public lastCreatedMatchId: number;
   public openedModal: OpenedModal<null>;
   public teamMatchesObservable: Observable<PaginatedResponse<TeamMatch>>;
   public teamMatchForm: FormGroup;

   constructor(
      private teamStageService: TeamStageNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamMatchService: TeamMatchNewService
   ) {}

   get teamStagesFormArray(): FormArray {
      return this.teamMatchForm.get('team_stages') as FormArray;
   }

   public addTeamStage(teamStageId?: number): void {
      this.teamStagesFormArray.push(
         new FormGroup({
            id: new FormControl(teamStageId || null, [Validators.required])
         })
      );
   }

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.teamMatchForm, 'teamMatch', (formGroup, field, value) => {
         if (field === 'team_stages') {
            this.clearTeamStagesFormArray();
            if (value.length) {
               value.forEach(teamStage => {
                  if (!this.teamStages) {
                     this.teamStages = [];
                  }
                  if (!this.teamStages.find(item => item.id === teamStage.id)) {
                     this.teamStages.push(teamStage);
                  }
                  this.addTeamStage(teamStage.id);
               });
            }
         } else {
            if (formGroup.get(field)) {
               formGroup.patchValue({ [field]: value });
            }
         }
      });
      if (!simpleChanges.teamMatch.firstChange && simpleChanges.teamMatch.currentValue.match.state === MatchState.Ended) {
         this.teamStages = simpleChanges.teamMatch.currentValue.team_stages;
         this.teamMatchForm.disable();
      }
   }

   public ngOnInit(): void {
      this.setTeamMatchesObservable();
      this.getTeamStagesData();
      this.teamMatchForm = new FormGroup({
         team_stages: new FormArray([]),
         match_id: new FormControl(null, [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.teamMatchForm.invalid) {
         return;
      }

      this.teamMatch ? this.updateTeamMatch(this.teamMatchForm.value) : this.createTeamMatch(this.teamMatchForm.value);
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: null, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   public removeTeamStage(index: number): void {
      this.teamStagesFormArray.removeAt(index);
   }

   public resetTeamMatchForm(): void {
      this.clearTeamStagesFormArray();
      this.teamMatchForm.reset();
      if (this.teamMatch) {
         this.teamMatch.team_stages.forEach(teamStage => this.addTeamStage(teamStage.id));
         Object.entries(this.teamMatch as any).forEach(
            ([field, value]) => this.teamMatchForm.get(field) && this.teamMatchForm.patchValue({ [field]: value })
         );
      }
      this.openedModal.reference.close();
   }

   public setTeamMatchesObservable(): void {
      const search: TeamMatchSearch = {
         limit: SettingsService.maxLimitValues.teamMatches,
         page: 1,
         relations: ['match.clubHome', 'match.clubAway', 'teamStages.competition'],
         states: [MatchState.Active]
      };
      this.teamMatchesObservable = this.teamMatchService.getTeamMatches(search);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private clearTeamStagesFormArray(): void {
      UtilsService.clearFormArray(this.teamStagesFormArray);
   }

   private createTeamMatch(teamMatch: TeamMatch): void {
      this.teamMatchService.createTeamMatch(teamMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч командного №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} створено`
         );
         this.teamMatchForm.get('match_id').reset();
         this.lastCreatedMatchId = response.match_id;
      });
   }

   private getTeamStagesData(): void {
      const search: TeamStageSearch = {
         relations: ['competition'],
         states: [TeamStageState.NotStarted, TeamStageState.Active],
         limit: SettingsService.maxLimitValues.teamStages,
         page: 1,
         sequence: Sequence.Ascending,
         orderBy: 'round'
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = response.data;
      });
   }

   private updateTeamMatch(teamMatch: TeamMatch): void {
      this.teamMatchService.updateTeamMatch(this.teamMatch.id, teamMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч командного №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
