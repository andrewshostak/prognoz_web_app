import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-championship-match',
    templateUrl: './championship-match.component.html',
    styleUrls: ['./championship-match.component.scss']
})
export class ChampionshipMatchComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private championshipMatchService: ChampionshipMatchService,
        private currentStateService: CurrentStateService,
        private location: Location,
        private titleService: TitleService
    ) {}

    authenticatedUser: User;
    championshipMatch: ChampionshipMatch;
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatch: string;

    goBack() {
        this.location.back();
    }

    ngOnInit() {
        this.authenticatedUser = this.currentStateService.getUser();
        this.activatedRoute.params.forEach((params: Params) => {
            this.getChampionshipMatchData(params['id']);
        });
    }

    private getChampionshipMatchData(id: number) {
        this.championshipMatchService.getChampionshipMatch(id).subscribe(
            response => {
                this.resetChampionshipMatchData();
                this.titleService.setTitle(`${response.championship_match.club_first.title} vs
                        ${response.championship_match.club_second.title}
                        ${response.championship_match.starts_at.slice(0, -3)} - Чемпіонат`);
                this.championshipMatch = response.championship_match;
            },
            error => {
                this.resetChampionshipMatchData();
                this.errorChampionshipMatch = error;
            }
        );
    }

    private resetChampionshipMatchData(): void {
        this.championshipMatch = null;
        this.errorChampionshipMatch = null;
    }
}
