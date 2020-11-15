import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupStage } from '@models/cup/cup-stage.model';
import { UserNew } from '@models/new/user-new.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupStageService } from '@services/cup/cup-stage.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
   selector: 'app-cup-cup-match-form',
   templateUrl: './cup-cup-match-form.component.html',
   styleUrls: ['./cup-cup-match-form.component.scss']
})
export class CupCupMatchFormComponent implements OnChanges, OnInit {
   @Input() public cupCupMatch: CupCupMatch;

   public cupCupMatchForm: FormGroup;
   public cupStages: CupStage[];
   public errorCupStages: string;
   public homeUser: UserNew;
   public awayUser: UserNew;

   constructor(
      private cupCupMatchService: CupCupMatchService,
      private cupStageService: CupStageService,
      private location: Location,
      private notificationsService: NotificationsService
   ) {}

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.cupCupMatchForm, 'cupCupMatch');
      if (simpleChanges.cupCupMatch.currentValue) {
         this.homeUser = simpleChanges.cupCupMatch.currentValue.home_user;
         this.awayUser = simpleChanges.cupCupMatch.currentValue.away_user;
      }
   }

   public ngOnInit() {
      this.getCupStagesData();
      this.cupCupMatchForm = new FormGroup({
         cup_stage_id: new FormControl('', [Validators.required]),
         home_user_id: new FormControl('', [Validators.required]),
         away_user_id: new FormControl('', [Validators.required]),
         group_number: new FormControl(null, [Validators.min(1)]),
         type: new FormControl('manual', [Validators.required])
      });
   }

   public onSubmit(): void {
      if (this.cupCupMatchForm.valid) {
         this.cupCupMatch ? this.updateCupCupMatch(this.cupCupMatchForm.value) : this.createCupCupMatch(this.cupCupMatchForm.value);
      }
   }

   public resetCupCupMatchForm(): void {
      this.cupCupMatchForm.reset();
   }

   public swapUsers(): void {
      [this.homeUser, this.awayUser] = [this.awayUser, this.homeUser];
      this.cupCupMatchForm.patchValue({
         home_user_id: this.cupCupMatchForm.get('away_user_id').value,
         away_user_id: this.cupCupMatchForm.get('home_user_id').value
      });
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   private getCupStagesData(): void {
      this.cupStageService.getCupStages(null, false, false).subscribe(
         response => {
            this.cupStages = response.cup_stages;
         },
         error => {
            this.errorCupStages = error;
         }
      );
   }

   private createCupCupMatch(cupCupMatch: CupCupMatch): void {
      this.cupCupMatchService.createCupCupMatch(cupCupMatch).subscribe(
         () => {
            this.notificationsService.success('Успішно', 'Кубок-матч створено');
            this.cupCupMatchForm.reset({ cup_stage_id: cupCupMatch.cup_stage_id, type: 'manual' });
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }

   private updateCupCupMatch(cupCupMatch: CupCupMatch): void {
      this.cupCupMatchService.updateCupCupMatch(cupCupMatch, this.cupCupMatch.id).subscribe(
         () => {
            this.notificationsService.success('Успішно', 'Кубок-матч змінено');
            this.location.back();
         },
         errors => {
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }
}
