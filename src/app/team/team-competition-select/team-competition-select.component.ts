import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { Season } from '@models/season.model';
import { SeasonService } from '@services/season.service';

@Component({
    selector: 'app-team-competition-select',
    templateUrl: './team-competition-select.component.html',
    styleUrls: ['./team-competition-select.component.scss']
})
export class TeamCompetitionSelectComponent implements OnInit {
    constructor(
        private activatedRoute: ActivatedRoute,
        private competitionService: CompetitionService,
        private currentStateService: CurrentStateService,
        private router: Router,
        private seasonService: SeasonService
    ) {}

    archiveCompetitions: Competition[];
    competitions: Competition[];
    errorArchiveCompetitions: string;
    errorCompetitions: string;
    errorSeasons: string;
    filterTeamCompetitionsForm: FormGroup;
    seasons: Season[];

    getFilterData(): void {
        if (!this.seasons) {
            this.getSeasonsData();
        }
    }

    isSelected(competition: Competition): boolean {
        return this.getTeamCompetitionIdFromUrl() === competition.id;
    }

    navigate(competition: Competition, type: 'main' | 'archive' = 'main'): void {
        const urlArray = this.getRouterUrlAsArray();
        urlArray[3] = competition.id.toString();
        urlArray[4] = urlArray[4] ? urlArray[4] : 'matches';

        if (type === 'main') {
            this.currentStateService.teamCompetitionId = competition.id;
        }

        this.router.navigate(urlArray);
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(() => {
            if (this.getRouterUrlAsArray().includes('get-active')) {
                if (this.currentStateService.teamCompetitionId) {
                    this.router.navigate(['/team', 'competitions', this.currentStateService.teamCompetitionId, 'matches']);
                }
            }
        });

        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, true, true).subscribe(
            response => {
                this.errorCompetitions = null;
                if (response && response.competitions && response.competitions.length) {
                    this.competitions = response.competitions;
                    if (this.getRouterUrlAsArray().includes('get-active') && !this.currentStateService.teamCompetitionId) {
                        this.router.navigate(['/team', 'competitions', response.competitions[0].id, 'matches']);
                    }
                }
            },
            error => {
                this.competitions = null;
                this.errorCompetitions = error;
            }
        );

        this.filterTeamCompetitionsForm = new FormGroup({
            season_id: new FormControl(''),
            competition_id: new FormControl('')
        });

        this.filterTeamCompetitionsForm.get('season_id').valueChanges.subscribe(value => {
            this.archiveCompetitions = null;
            if (value) {
                this.getCompetitionsData();
            }
        });

        this.filterTeamCompetitionsForm.get('competition_id').valueChanges.subscribe(value => {
            if (value) {
                this.navigate(this.archiveCompetitions.find(competition => competition.id.toString() === value), 'archive');
            }
        });
    }

    resetTeamCompetitionsFormFilters(): void {
        this.filterTeamCompetitionsForm.reset();
    }

    private getCompetitionsData(): void {
        this.competitionService
            .getCompetitions(null, environment.tournaments.team.id, this.filterTeamCompetitionsForm.get('season_id').value)
            .subscribe(
                response => {
                    this.errorArchiveCompetitions = null;
                    if (response) {
                        this.archiveCompetitions = response.competitions;
                    }
                },
                error => {
                    this.competitions = null;
                    this.errorArchiveCompetitions = error;
                }
            );
    }

    private getRouterUrlAsArray(): string[] {
        return this.router.url.split('/');
    }

    private getSeasonsData(): void {
        this.seasonService.getSeasons().subscribe(
            response => {
                this.errorSeasons = null;
                if (response) {
                    this.seasons = response.seasons;
                }
            },
            error => {
                this.seasons = null;
                this.errorSeasons = error;
            }
        );
    }

    private getTeamCompetitionIdFromUrl(): number {
        return parseInt(this.getRouterUrlAsArray()[3], 10);
    }
}
