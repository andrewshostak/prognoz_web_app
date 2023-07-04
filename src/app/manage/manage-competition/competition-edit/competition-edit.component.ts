import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Competition } from '@models/v2/competition.model';
import { CompetitionService } from '@services/api/v2/competition.service';

@Component({
   selector: 'app-competition-edit',
   templateUrl: './competition-edit.component.html',
   styleUrls: ['./competition-edit.component.scss']
})
export class CompetitionEditComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private competitionService: CompetitionService) {}

   competition: Competition;

   ngOnInit() {
      this.getCompetitionData(this.activatedRoute.snapshot.params.id);
   }

   private getCompetitionData(id: number) {
      this.competitionService.getCompetition(id).subscribe(response => (this.competition = response));
   }
}
