import { Component, OnInit } from '@angular/core';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { environment } from '@env';

@Component({
    selector: 'app-championship-last-results',
    templateUrl: './championship-last-results.component.html',
    styleUrls: ['./championship-last-results.component.scss']
})
export class ChampionshipLastResultsComponent implements OnInit {
    constructor(private championshipMatchService: ChampionshipMatchService) {}

    championshipMatches: ChampionshipMatch[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;

    getChampionshipMatchesData() {
        const param = [{ parameter: 'filter', value: 'last' }];
        this.championshipMatchService.getChampionshipMatches(param).subscribe(
            response => {
                if (response) {
                    this.championshipMatches = response.championship_matches;
                }
            },
            error => {
                this.errorChampionshipMatches = error;
            }
        );
    }

    ngOnInit() {
        this.getChampionshipMatchesData();
    }
}