import { Component, OnInit } from '@angular/core';

import { ChampionshipMatch } from '../../shared/models/championship-match.model';
import { ChampionshipMatchService } from '../shared/championship-match.service';
import { environment } from '../../../environments/environment';
import { TitleService } from '../../core/title.service';

@Component({
    selector: 'app-championship-results',
    templateUrl: './championship-results.component.html',
    styleUrls: ['./championship-results.component.css']
})
export class ChampionshipResultsComponent implements OnInit {
    constructor(private championshipMatchService: ChampionshipMatchService, private titleService: TitleService) {}

    championshipMatches: ChampionshipMatch[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;

    ngOnInit() {
        this.titleService.setTitle('Результати матчів - Чемпіонат');
        const param = [{ parameter: 'filter', value: 'ended' }];
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
}
