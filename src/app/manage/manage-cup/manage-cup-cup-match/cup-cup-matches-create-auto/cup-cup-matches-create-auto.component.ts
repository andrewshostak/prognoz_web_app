import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { NotificationsService } from 'angular2-notifications';
import { CupStageNew } from '@models/new/cup-stage-new.model';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-cup-cup-matches-create-auto',
   templateUrl: './cup-cup-matches-create-auto.component.html',
   styleUrls: ['./cup-cup-matches-create-auto.component.scss']
})
export class CupCupMatchesCreateAutoComponent implements OnInit {
   constructor(
      private cupCupMatchService: CupCupMatchService,
      private cupStageService: CupStageNewService,
      private notificationsService: NotificationsService
   ) {}

   public cupStages: CupStageNew[];
   cupCupMatchAutoForm: FormGroup;
   cupCupMatches: CupCupMatch[];

   ngOnInit() {
      this.cupCupMatchAutoForm = new FormGroup({
         type: new FormControl({ value: 'auto', disabled: true }, [Validators.required]),
         to: new FormControl('', [Validators.required]),
         number_of_matches: new FormControl(null, [Validators.min(1)])
      });
      const search: CupStageSearch = {
         active: ModelStatus.Falsy,
         ended: ModelStatus.Falsy,
         limit: SettingsService.maxLimitValues.cupStages,
         orderBy: 'id',
         page: 1,
         relations: ['competition'],
         sequence: Sequence.Ascending
      };
      this.cupStageService.getCupStages(search).subscribe(response => (this.cupStages = response.data));
   }

   onSubmit(): void {
      if (this.cupCupMatchAutoForm.valid) {
         this.cupCupMatchService.createCupCupMatchesAuto(this.cupCupMatchAutoForm.getRawValue()).subscribe(
            response => {
               this.cupCupMatches = response;
               this.resetCupCupMatchAutoForm();
               this.notificationsService.success('Успішно', 'Кубок-матчі створено');
            },
            errors => {
               errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
         );
      }
   }

   resetCupCupMatchAutoForm(): void {
      this.cupCupMatchAutoForm.reset({ type: 'auto' });
   }
}
