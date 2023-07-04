import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CupCupMatchService } from '@services/api/v2/cup/cup-cup-match.service';
import { CupStageService } from '@services/api/v2/cup/cup-stage.service';
import { NotificationsService } from 'angular2-notifications';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { CupStageSearch } from '@models/search/cup/cup-stage-search.model';
import { CupStageState } from '@enums/cup-stage-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { PaginationService } from '@services/pagination.service';

@Component({
   selector: 'app-cup-cup-matches-create-auto',
   templateUrl: './cup-cup-matches-create-auto.component.html',
   styleUrls: ['./cup-cup-matches-create-auto.component.scss']
})
export class CupCupMatchesCreateAutoComponent implements OnInit {
   constructor(
      private cupCupMatchService: CupCupMatchService,
      private cupStageService: CupStageService,
      private notificationsService: NotificationsService
   ) {}

   public cupStages: CupStage[];
   cupCupMatchAutoForm: FormGroup;

   ngOnInit() {
      this.cupCupMatchAutoForm = new FormGroup({
         cup_stage_id: new FormControl('', [Validators.required]),
         number_of_matches_in_first_stage: new FormControl(null, [Validators.min(1)])
      });
      const search: CupStageSearch = {
         states: [CupStageState.NotStarted],
         limit: PaginationService.limit.cupStages,
         orderBy: 'id',
         page: 1,
         relations: ['competition'],
         round: 1,
         sequence: Sequence.Ascending
      };
      this.cupStageService.getCupStages(search).subscribe(response => (this.cupStages = response.data));
   }

   onSubmit(): void {
      if (this.cupCupMatchAutoForm.invalid) {
         return;
      }

      this.cupCupMatchService
         .createCupCupMatches(
            this.cupCupMatchAutoForm.get('cup_stage_id').value,
            this.cupCupMatchAutoForm.get('number_of_matches_in_first_stage').value
         )
         .subscribe(() => {
            this.cupCupMatchAutoForm.reset();
            this.notificationsService.success('Успішно', 'Матчі створено');
         });
   }
}
