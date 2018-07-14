import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { environment } from '@env';
import { TitleService } from '@services/title.service';

@Component({
    selector: 'app-championship-competition-winners',
    templateUrl: './championship-competition-winners.component.html',
    styleUrls: ['./championship-competition-winners.component.scss']
})
export class ChampionshipCompetitionWinnersComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private competitionService: CompetitionService,
        private router: Router,
        private titleService: TitleService
    ) {}

    awardsImagesUrl: string = environment.apiImageAwards;
    competition: Competition;
    errorCompetition: string | Array<string>;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.titleService.setTitle(`Переможці конкурсу ${params['competitionId']} - Чемпіонат`);
            this.competitionService.getCompetition(params['competitionId']).subscribe(
                response => {
                    this.resetCompetitionWinnerData();
                    if (response.tournament_id !== environment.tournaments.championship.id) {
                        this.router.navigate(['/404']);
                    }
                    this.competition = response;
                },
                error => {
                    this.resetCompetitionWinnerData();
                    this.errorCompetition = error;
                }
            );
        });
    }

    private resetCompetitionWinnerData(): void {
        this.competition = null;
        this.errorCompetition = null;
    }
}
