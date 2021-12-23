import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CompetitionNew } from '@models/new/competition-new.model';
import { CompetitionNewService } from '@services/new/competition-new.service';

@Component({
   selector: 'app-competition-edit',
   templateUrl: './competition-edit.component.html',
   styleUrls: ['./competition-edit.component.scss']
})
export class CompetitionEditComponent implements OnInit {
   constructor(private activatedRoute: ActivatedRoute, private competitionService: CompetitionNewService) {}

   competition: CompetitionNew;

   ngOnInit() {
      this.getCompetitionData(this.activatedRoute.snapshot.params.id);
   }

   private getCompetitionData(id: number) {
      this.competitionService.getCompetition(id).subscribe(response => (this.competition = response));
   }
}
