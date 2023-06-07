import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { CupMatch } from '@models/v2/cup/cup-match.model';
import { OpenedModal } from '@models/opened-modal.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupMatchSearch } from '@models/search/cup-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { Sequence } from '@enums/sequence.enum';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { CupStageState } from '@enums/cup-stage-state.enum';

@Component({
   selector: 'app-cup-match-form',
   styleUrls: ['./cup-match-form.component.scss'],
   templateUrl: './cup-match-form.component.html'
})
export class CupMatchFormComponent implements OnChanges, OnInit {
   @Input() public cupMatch: CupMatch;

   public cupStages: CupStage[];
   public cupMatchForm: FormGroup;
   public cupMatchesObservable: Observable<PaginatedResponse<CupMatch>>;
   public lastCreatedMatchId: number;
   public openedModal: OpenedModal<null>;

   constructor(
      private cupMatchService: CupMatchNewService,
      private cupStageService: CupStageNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   get cupStagesFormArray(): FormArray {
      return this.cupMatchForm.get('cup_stages') as FormArray;
   }

   public addCupStage(cupStageId?: number): void {
      this.cupStagesFormArray.push(
         new FormGroup({
            id: new FormControl(cupStageId || null, [Validators.required])
         })
      );
   }

   public ngOnChanges(simpleChanges: SimpleChanges): void {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.cupMatchForm, 'cupMatch', (formGroup, field, value) => {
         if (field === 'cup_stages') {
            this.clearCupStagesFormArray();
            if (value.length) {
               value.forEach(cupStage => {
                  if (!this.cupStages) {
                     this.cupStages = [];
                  }
                  if (!this.cupStages.find(item => item.id === cupStage.id)) {
                     this.cupStages.push(cupStage);
                  }
                  this.addCupStage(cupStage.id);
               });
            }
         } else {
            if (formGroup.get(field)) {
               formGroup.patchValue({ [field]: value });
            }
         }
      });
      if (!simpleChanges.cupMatch.firstChange && simpleChanges.cupMatch.currentValue.match.state === MatchState.Ended) {
         this.cupStages = simpleChanges.cupMatch.currentValue.cup_stages;
         this.cupMatchForm.disable();
      }
   }

   public ngOnInit(): void {
      this.setCupMatchesObservable();
      this.getCupStagesData();
      this.cupMatchForm = new FormGroup({
         cup_stages: new FormArray([]),
         match_id: new FormControl(null, [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.cupMatchForm.invalid) {
         return;
      }

      this.cupMatch ? this.updateCupMatch(this.cupMatchForm.value) : this.createCupMatch(this.cupMatchForm.value);
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: null, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   public removeCupStage(index: number): void {
      this.cupStagesFormArray.removeAt(index);
   }

   public resetCupMatchForm(): void {
      this.clearCupStagesFormArray();
      this.cupMatchForm.reset();
      if (this.cupMatch) {
         this.cupMatch.cup_stages.forEach(cupStage => this.addCupStage(cupStage.id));
         Object.entries(this.cupMatch as any).forEach(
            ([field, value]) => this.cupMatchForm.get(field) && this.cupMatchForm.patchValue({ [field]: value })
         );
      }
      this.openedModal.reference.close();
   }

   public setCupMatchesObservable(): void {
      const search: CupMatchSearch = {
         limit: SettingsService.maxLimitValues.cupMatches,
         page: 1,
         relations: ['match.clubHome', 'match.clubAway'],
         states: [MatchState.Active]
      };
      this.cupMatchesObservable = this.cupMatchService.getCupMatches(search);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private clearCupStagesFormArray(): void {
      UtilsService.clearFormArray(this.cupStagesFormArray);
   }

   private createCupMatch(cupMatch: CupMatch): void {
      this.cupMatchService.createCupMatch(cupMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч кубку №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} створено`
         );
         this.cupMatchForm.get('match_id').reset();
         this.lastCreatedMatchId = response.match_id;
      });
   }

   private getCupStagesData(): void {
      const search: CupStageSearch = {
         limit: SettingsService.maxLimitValues.cupStages,
         page: 1,
         relations: ['competition'],
         sequence: Sequence.Ascending,
         orderBy: 'round',
         states: [CupStageState.Active, CupStageState.NotStarted]
      };
      this.cupStageService.getCupStages(search).subscribe(response => {
         this.cupStages = response.data;
      });
   }

   private updateCupMatch(cupMatch: CupMatch): void {
      this.cupMatchService.updateCupMatch(this.cupMatch.id, cupMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч кубку №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
