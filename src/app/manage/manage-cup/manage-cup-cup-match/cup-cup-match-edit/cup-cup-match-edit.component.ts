import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupCupMatchNewService } from '@services/new/cup-cup-match-new.service';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';

@Component({
   selector: 'app-cup-cup-match-edit',
   templateUrl: './cup-cup-match-edit.component.html',
   styleUrls: ['./cup-cup-match-edit.component.scss']
})
export class CupCupMatchEditComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private cupCupMatchService: CupCupMatchNewService) {}

   cupCupMatch: CupCupMatch;

   ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getCupCupMatchData(params.id);
      });
   }

   private getCupCupMatchData(cupCupMatchId: number): void {
      this.cupCupMatchService
         .getCupCupMatch(cupCupMatchId, ['homeUser', 'awayUser', 'cupStage.competition'])
         .subscribe(response => (this.cupCupMatch = response));
   }
}
