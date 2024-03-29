import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CupMatch } from '@models/v2/cup/cup-match.model';
import { CupMatchService } from '@services/api/v2/cup/cup-match.service';

@Component({
   selector: 'app-cup-match-edit',
   styleUrls: ['./cup-match-edit.component.scss'],
   templateUrl: './cup-match-edit.component.html'
})
export class CupMatchEditComponent implements OnInit {
   public cupMatch: CupMatch;

   constructor(private activatedRoute: ActivatedRoute, private cupMatchService: CupMatchService) {}

   public ngOnInit() {
      this.activatedRoute.params.forEach((params: Params) => {
         this.getCupMatchData(params.id);
      });
   }

   private getCupMatchData(cupMatchId: number): void {
      this.cupMatchService.getCupMatch(cupMatchId).subscribe(response => {
         this.cupMatch = response;
      });
   }
}
