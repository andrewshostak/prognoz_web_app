import { Component, OnInit }        from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

import { Competition }              from '../../../shared/models/competition.model';
import { CompetitionService }       from '../../../core/competition.service';


@Component({
  selector: 'app-competition-edit',
  templateUrl: './competition-edit.component.html',
  styleUrls: ['./competition-edit.component.css']
})
export class CompetitionEditComponent implements OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private competitionService: CompetitionService,
    ) { }

    competition: Competition;
    errorCompetition: string;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getCompetitionData(params['id']);
        });
    }

    private getCompetitionData(id: number) {
        this.competitionService.getCompetition(id).subscribe(
            response => {
                this.competition = response;
            },
            error => {
                this.errorCompetition = error;
            }
        );
    }
}
