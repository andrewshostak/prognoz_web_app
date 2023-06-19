import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupStageService } from '@services/v2/cup/cup-stage.service';
import { CupStage } from '@models/v2/cup/cup-stage.model';

@Component({
   selector: 'app-cup-stage-edit',
   templateUrl: './cup-stage-edit.component.html',
   styleUrls: ['./cup-stage-edit.component.scss']
})
export class CupStageEditComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private cupStageService: CupStageService) {}

   cupStage: CupStage;

   ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getCupStageData(params.id);
      });
   }

   private getCupStageData(cupStageId: number): void {
      this.cupStageService
         .getCupStage(cupStageId, ['cupMatches.match.clubHome', 'cupMatches.match.clubAway'])
         .subscribe(response => (this.cupStage = response));
   }
}
