import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { CupStageState } from '@enums/cup-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupMatchNew } from '@models/new/cup-match-new.model';
import { CupMatchNewService } from '@services/new/cup-match-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { CupStageType } from '@models/cup/cup-stage-type.model';
import { CupStageTypeService } from '@services/cup/cup-stage-type.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { UtilsService } from '@services/utils.service';
import { CupMatchSearch } from '@models/search/cup-match-search.model';
import { MatchState } from '@enums/match-state.enum';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-cup-stage-form',
   templateUrl: './cup-stage-form.component.html',
   styleUrls: ['./cup-stage-form.component.scss']
})
export class CupStageFormComponent implements OnChanges, OnInit {
   constructor(
      private competitionService: CompetitionNewService,
      private cupMatchService: CupMatchNewService,
      private cupStageService: CupStageService,
      private cupStageTypeService: CupStageTypeService,
      private location: Location,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   @Input() cupStage: CupStage;

   competitions: CompetitionNew[];
   cupMatches: CupMatchNew[];
   cupStageForm: FormGroup;
   cupStageTypes: CupStageType[];
   confirmModalMessage: string;
   confirmModalSubmit: (event) => void;
   errorCupStageTypes: string;
   openedModalReference: NgbModalRef;

   get cupMatchesFormArray(): FormArray {
      return this.cupStageForm.get('cup_matches') as FormArray;
   }

   addCupMatch(cupMatchId?: number): void {
      this.cupMatchesFormArray.push(
         new FormGroup({
            id: new FormControl(cupMatchId || null, [Validators.required])
         })
      );
   }

   ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.cupStageForm, 'cupStage', (formGroup, field, value) => {
         if (['active', 'ended'].includes(field)) {
            return;
         }

         if (field === 'state') {
            switch (value) {
               case CupStageState.Active:
                  formGroup.get('active').setValue(true);
                  break;
               case CupStageState.Ended:
                  formGroup.get('ended').setValue(true);
                  break;
            }
         } else if (field === 'cup_matches') {
            this.clearCupMatchesFormArray();
            if (value.length) {
               value.forEach(cupMatch => {
                  if (!this.cupMatches) {
                     this.cupMatches = [];
                  }
                  if (!this.cupMatches.find(item => item.id === cupMatch.id)) {
                     this.cupMatches.push(cupMatch);
                  }
                  this.addCupMatch(cupMatch.id);
               });
            }
         } else {
            if (formGroup.get(field)) {
               formGroup.patchValue({ [field]: value });
            }
         }
      });
   }

   ngOnInit() {
      this.getCompetitionsData();
      this.getCupStageTypesData();
      this.getCupMatchesData();
      this.cupStageForm = new FormGroup({
         competition_id: new FormControl('', [Validators.required]),
         cup_stage_type_id: new FormControl('', [Validators.required]),
         round: new FormControl('', [Validators.required]),
         title: new FormControl('', [Validators.required]),
         active: new FormControl(false),
         ended: new FormControl(false),
         cup_matches: new FormArray([])
      });
   }

   onSubmit(): void {
      if (this.cupStageForm.valid) {
         this.cupStage ? this.updateCupStage(this.cupStageForm.value) : this.createCupStage(this.cupStageForm.value);
      }
   }

   openConfirmModal(content: NgbModalRef): void {
      this.confirmModalMessage = 'Очистити форму від змін?';
      this.confirmModalSubmit = () => this.resetCupStageForm();
      this.openedModalReference = this.ngbModalService.open(content);
   }

   removeCupMatch(index: number): void {
      this.cupMatchesFormArray.removeAt(index);
   }

   resetCupStageForm(): void {
      this.clearCupMatchesFormArray();
      this.cupStageForm.reset();
      if (this.cupStage) {
         this.cupStage.cup_matches.forEach(cupMatch => {
            this.addCupMatch(cupMatch.id);
         });
         Object.entries(this.cupStage).forEach(
            ([field, value]) => this.cupStageForm.get(field) && this.cupStageForm.patchValue({ [field]: value })
         );
      }
      this.openedModalReference.close();
   }

   private clearCupMatchesFormArray(): void {
      UtilsService.clearFormArray(this.cupMatchesFormArray);
   }

   private createCupStage(cupStage: CupStage): void {
      this.cupStageService.createCupStage(cupStage).subscribe(
         response => {
            this.notificationsService.success('Успішно', 'Кубкову стадію створено');
            this.location.back();
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }

   private getCupMatchesData(): void {
      const search: CupMatchSearch = {
         limit: SettingsService.maxLimitValues.cupMatches,
         page: 1,
         states: [MatchState.Active],
         relations: ['match.clubHome', 'match.clubAway']
      };
      this.cupMatchService.getCupMatches(search).subscribe(response => {
         if (!this.cupMatches) {
            this.cupMatches = response.data;
         } else {
            response.data.forEach(cupMatch => {
               if (!this.cupMatches.find(item => item.id === cupMatch.id)) {
                  this.cupMatches.push(cupMatch);
               }
            });
         }
      });
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         tournamentId: Tournament.Cup,
         states: [CompetitionState.NotStarted, CompetitionState.Applications, CompetitionState.Active]
      };
      this.competitionService.getCompetitions(search).subscribe(response => (this.competitions = response.data));
   }

   private getCupStageTypesData(): void {
      this.cupStageTypeService.getCupStageTypes().subscribe(
         response => {
            this.cupStageTypes = response;
         },
         error => {
            this.errorCupStageTypes = error;
         }
      );
   }

   private updateCupStage(cupStage: CupStage): void {
      this.cupStageService.updateCupStage(cupStage, this.cupStage.id).subscribe(
         response => {
            this.notificationsService.success('Успішно', 'Кубкову стадію змінено');
            this.location.back();
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }
}
