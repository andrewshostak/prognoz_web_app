import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamMatchNew } from '@models/new/team-match-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { TeamMatchSearch } from '@models/search/team-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamMatchNewService } from '@services/new/team-match-new.service';
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
   @Input() public teamMatch: TeamMatchNew;

   public competitions: CompetitionNew[];
   public lastCreatedMatchId: number;
   public openedModal: OpenedModal<null>;
   public teamMatchesObservable: Observable<PaginatedResponse<TeamMatchNew>>;
   public teamMatchForm: FormGroup;

   constructor(
      private competitionService: CompetitionNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamMatchService: TeamMatchNewService
   ) {}

   get competitionsFormArray(): FormArray {
      return this.teamMatchForm.get('competitions') as FormArray;
   }

   public addCompetition(pivot?: { competition_id: number; round: number; number_in_round: number; number_in_competition: number }): void {
      this.competitionsFormArray.push(
         new FormGroup({
            competition_id: new FormControl(pivot ? pivot.competition_id : null, [Validators.required]),
            number_in_competition: new FormControl({ value: pivot ? pivot.number_in_competition : null, disabled: !this.teamMatch }, [
               Validators.required,
               Validators.min(1)
            ]),
            number_in_round: new FormControl({ value: pivot ? pivot.number_in_round : null, disabled: !this.teamMatch }, [
               Validators.required,
               Validators.min(1)
            ]),
            round: new FormControl({ value: pivot ? pivot.round : null, disabled: !this.teamMatch }, [
               Validators.required,
               Validators.min(1)
            ])
         })
      );
   }

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.teamMatchForm, 'teamMatch', (formGroup, field, value) => {
         if (field === 'competitions') {
            this.clearCompetitionsFormArray();
            if (value.length) {
               value.forEach(competition => {
                  if (!this.competitions) {
                     this.competitions = [];
                  }
                  if (!this.competitions.find(item => item.id === competition.id)) {
                     this.competitions.push(competition);
                  }
                  this.addCompetition(competition.pivot);
               });
            }
         } else {
            if (formGroup.get(field)) {
               formGroup.patchValue({ [field]: value });
            }
         }
      });
      if (!simpleChanges.teamMatch.firstChange && simpleChanges.teamMatch.currentValue.match.ended) {
         this.competitions = simpleChanges.teamMatch.currentValue.competitions;
         this.teamMatchForm.disable();
      }
   }

   public ngOnInit(): void {
      this.setTeamMatchesObservable();
      this.getCompetitionsData();
      this.teamMatchForm = new FormGroup({
         competitions: new FormArray([]),
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

   public removeCompetition(index: number): void {
      this.competitionsFormArray.removeAt(index);
   }

   public resetTeamMatchForm(): void {
      this.clearCompetitionsFormArray();
      this.teamMatchForm.reset();
      if (this.teamMatch) {
         // todo: fix competitions to teamStages
         // this.teamMatch.competitions.forEach(competition => this.addCompetition(competition.pivot));
         // Object.entries(this.teamMatch).forEach(
         //    ([field, value]) => this.teamMatchForm.get(field) && this.teamMatchForm.patchValue({ [field]: value })
         // );
      }
      this.openedModal.reference.close();
   }

   public setTeamMatchesObservable(): void {
      const search: TeamMatchSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.teamMatches,
         page: 1,
         relations: ['match.clubHome', 'match.clubAway', 'teamStages.competition']
      };
      this.teamMatchesObservable = this.teamMatchService.getTeamMatches(search);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private clearCompetitionsFormArray(): void {
      UtilsService.clearFormArray(this.competitionsFormArray);
   }

   private createTeamMatch(teamMatch: TeamMatchNew): void {
      this.teamMatchService.createTeamMatch(teamMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч командного чемпіонату №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} створено`
         );
         this.teamMatchForm.get('match_id').reset();
         this.lastCreatedMatchId = response.match_id;
      });
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.teamMatches,
         page: 1,
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = response.data;
      });
   }

   private updateTeamMatch(teamMatch: TeamMatchNew): void {
      this.teamMatchService.updateTeamMatch(this.teamMatch.id, teamMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч командного чемпіонату №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
