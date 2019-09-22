import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModelStatus } from '@enums/model-status.enum';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupMatchNew } from '@models/new/cup-match-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CupMatchSearch } from '@models/search/cup-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CupStageService } from '@services/cup/cup-stage.service';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-cup-match-form',
   styleUrls: ['./cup-match-form.component.scss'],
   templateUrl: './cup-match-form.component.html'
})
export class CupMatchFormComponent implements OnChanges, OnInit {
   @Input() public cupMatch: CupMatchNew;

   public cupStages: CupStage[];
   public cupMatchForm: FormGroup;
   public cupMatchesObservable: Observable<PaginatedResponse<CupMatchNew>>;
   public lastCreatedMatchId: number;
   public openedModal: OpenedModal<null>;

   constructor(
      private cupMatchService: CupMatchNewService,
      private cupStageService: CupStageService,
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
      if (!simpleChanges.cupMatch.firstChange && simpleChanges.cupMatch.currentValue.match.ended) {
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
         Object.entries(this.cupMatch).forEach(
            ([field, value]) => this.cupMatchForm.get(field) && this.cupMatchForm.patchValue({ [field]: value })
         );
      }
      this.openedModal.reference.close();
   }

   public setCupMatchesObservable(): void {
      const search: CupMatchSearch = {
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.cupMatches,
         page: 1
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

   private createCupMatch(cupMatch: CupMatchNew): void {
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
      this.cupStageService.getCupStages(null, null, false).subscribe(response => {
         this.cupStages = response.cup_stages;
      });
   }

   private updateCupMatch(cupMatch: CupMatchNew): void {
      this.cupMatchService.updateCupMatch(this.cupMatch.id, cupMatch).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Матч кубку №${response.id} ${response.match.club_home.title} - ${response.match.club_away.title} змінено`
         );
      });
   }
}
