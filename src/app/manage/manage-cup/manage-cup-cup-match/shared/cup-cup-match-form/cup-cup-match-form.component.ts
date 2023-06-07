import { Location } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { CupCupMatchNew } from '@models/v2/cup-cup-match-new.model';
import { CupStageNew } from '@models/v2/cup-stage-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { CupCupMatchNewService } from '@services/new/cup-cup-match-new.service';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';
import { CupStageState } from '@enums/cup-stage-state.enum';
import { omit, uniqBy } from 'lodash';

@Component({
   selector: 'app-cup-cup-match-form',
   templateUrl: './cup-cup-match-form.component.html',
   styleUrls: ['./cup-cup-match-form.component.scss']
})
export class CupCupMatchFormComponent implements OnChanges, OnInit {
   @Input() public cupCupMatch: CupCupMatchNew;

   public cupCupMatchForm: FormGroup;
   public cupStages: CupStageNew[] = [];
   public homeUser: UserNew;
   public awayUser: UserNew;

   constructor(
      private cupCupMatchService: CupCupMatchNewService,
      private cupStageService: CupStageNewService,
      private userNewService: UserNewService,
      private location: Location,
      private notificationsService: NotificationsService
   ) {}

   public ngOnChanges(simpleChanges: SimpleChanges) {
      UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.cupCupMatchForm, 'cupCupMatch');
      if (simpleChanges.cupCupMatch.currentValue) {
         this.homeUser = simpleChanges.cupCupMatch.currentValue.home_user;
         this.awayUser = simpleChanges.cupCupMatch.currentValue.away_user;
         this.cupStages = uniqBy(this.cupStages.concat([simpleChanges.cupCupMatch.currentValue.cup_stage]), 'id');
      }
   }

   public ngOnInit() {
      this.getCupStagesData();
      this.cupCupMatchForm = new FormGroup({
         cup_stage_id: new FormControl('', [Validators.required]),
         home_user_id: new FormControl('', [Validators.required]),
         away_user_id: new FormControl('', [Validators.required]),
         group_number: new FormControl(null, [Validators.min(1)]),
         preserve: new FormGroup({
            cup_stage_id: new FormControl(false),
            user_ids: new FormControl(true),
            group_number: new FormControl(false)
         })
      });
   }

   public onSubmit(): void {
      if (this.cupCupMatchForm.invalid) {
         return;
      }

      const cupCupMatch = omit(this.cupCupMatchForm.value, ['preserve']) as CupCupMatchNew;
      this.cupCupMatch ? this.updateCupCupMatch(cupCupMatch) : this.createCupCupMatch(cupCupMatch);
   }

   public resetCupCupMatchForm(): void {
      this.cupCupMatchForm.reset();
   }

   public swapUsers(): void {
      const homeUserId = this.cupCupMatchForm.get('home_user_id').value;
      if (!this.homeUser && homeUserId) {
         this.userNewService.getUser(homeUserId).subscribe(response => {
            this.awayUser = response;
         });
      }

      const awayUserId = this.cupCupMatchForm.get('away_user_id').value;
      if (!this.awayUser && awayUserId) {
         this.userNewService.getUser(awayUserId).subscribe(response => {
            this.homeUser = response;
         });
      }

      if (this.homeUser && this.awayUser) {
         [this.homeUser, this.awayUser] = [this.awayUser, this.homeUser];
      }
      this.cupCupMatchForm.patchValue({
         home_user_id: awayUserId,
         away_user_id: homeUserId
      });
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   private getCupStagesData(): void {
      const search: CupStageSearch = {
         limit: SettingsService.maxLimitValues.cupStages,
         page: 1,
         orderBy: 'id',
         sequence: Sequence.Descending,
         relations: ['competition'],
         states: [CupStageState.NotStarted, CupStageState.Active]
      };
      this.cupStageService
         .getCupStages(search)
         .subscribe(response => (this.cupStages = uniqBy(this.cupStages.concat(response.data), 'id')));
   }

   private createCupCupMatch(cupCupMatch: CupCupMatchNew): void {
      this.cupCupMatchService.createCupCupMatch(cupCupMatch).subscribe(() => {
         this.notificationsService.success('Успішно', 'Кубок-матч створено');
         const preserve = this.cupCupMatchForm.get('preserve').value;
         if (!preserve.cup_stage_id) {
            this.cupCupMatchForm.get('cup_stage_id').reset();
         }
         if (!preserve.user_ids) {
            this.homeUser = null;
            this.awayUser = null;
            this.cupCupMatchForm.get('home_user_id').reset();
            this.cupCupMatchForm.get('away_user_id').reset();
         }
         if (!preserve.group_number) {
            this.cupCupMatchForm.get('group_number').reset();
         }
      });
   }

   private updateCupCupMatch(cupCupMatch: CupCupMatchNew): void {
      this.cupCupMatchService.updateCupCupMatch(this.cupCupMatch.id, cupCupMatch).subscribe(() => {
         this.notificationsService.success('Успішно', 'Кубок-матч змінено');
         this.location.back();
      });
   }
}
