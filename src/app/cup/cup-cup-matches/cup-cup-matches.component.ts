import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { CupCupMatch } from '@models/cup/cup-cup-match.model';
import { CupCupMatchService } from '@services/cup/cup-cup-match.service';
import { CupStage } from '@models/cup/cup-stage.model';
import { CupStageService } from '@services/cup/cup-stage.service';
import { CurrentStateService } from '@services/current-state.service';
import { environment } from '@env';
import { isNullOrUndefined } from 'util';
import { Season } from '@models/season.model';
import { SeasonService } from '@services/season.service';
import { Subscription } from 'rxjs/Subscription';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-cup-cup-matches',
    templateUrl: './cup-cup-matches.component.html',
    styleUrls: ['./cup-cup-matches.component.scss']
})
export class CupCupMatchesComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private competitionService: CompetitionService,
        private cupCupMatchService: CupCupMatchService,
        private cupStageService: CupStageService,
        private currentStateService: CurrentStateService,
        private seasonService: SeasonService,
        private titleService: TitleService,
        private router: Router
    ) {}

    authenticatedUser: User;
    activatedRouteSubscription: Subscription;
    competitionsCupStages: { [competitionId: string]: CupStage[] };
    cupStagesWithCupCupMatches: CupStage[];
    errorCompetitions: string;
    errorCupCupMatches: string;
    errorCupStages: string;
    errorSeasons: string;
    filterCupCupMatchesForm: FormGroup;
    seasons: Season[];
    seasonsCompetitions: { [seasonId: string]: Competition[] };
    userImageDefault: string;
    userImagesUrl: string;

    currentUserCupCupMatch(cupCupMatch): boolean {
        if (!this.authenticatedUser) {
            return false;
        }
        return this.authenticatedUser.id === cupCupMatch.home_user_id || this.authenticatedUser.id === cupCupMatch.away_user_id;
    }

    getFilterData(): void {
        if (!this.seasons) {
            this.getSeasonsData();
        }
    }

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Матчі - Кубок');
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.authenticatedUser = this.currentStateService.getUser();
        this.competitionsCupStages = {};
        this.seasonsCompetitions = {};
        this.filterCupCupMatchesForm = new FormGroup({
            active: new FormControl(''),
            season_id: new FormControl(''),
            competition_id: new FormControl(''),
            cup_stage_id: new FormControl('')
        });
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupCupMatchService
                .getCupCupMatches(isNullOrUndefined(params.active) ? null : !!parseInt(params.active, 10), params.cup_stage_id)
                .subscribe(
                    response => {
                        this.errorCupCupMatches = null;
                        if (response && response.cup_cup_matches) {
                            this.prepareViewData(response.cup_cup_matches);
                        } else {
                            this.cupStagesWithCupCupMatches = [];
                        }
                    },
                    error => {
                        this.cupStagesWithCupCupMatches = null;
                        this.errorCupCupMatches = error;
                    }
                );
        });
        this.filterCupCupMatchesForm.get('active').valueChanges.subscribe(value => {
            if (value) {
                this.router.navigate(['/cup', 'cup-matches', { active: 1 }]);
            }
        });
        this.filterCupCupMatchesForm.get('season_id').valueChanges.subscribe(value => {
            this.filterCupCupMatchesForm.get('competition_id').setValue('0');
            if (value && !this.seasonsCompetitions[value]) {
                this.getCompetitionsData();
            }
        });
        this.filterCupCupMatchesForm.get('competition_id').valueChanges.subscribe(value => {
            this.filterCupCupMatchesForm.get('cup_stage_id').setValue('0');
            if (value && value !== '0' && !this.competitionsCupStages[value]) {
                this.getCupStages();
            }
        });
        this.filterCupCupMatchesForm.get('cup_stage_id').valueChanges.subscribe(value => {
            if (value && value !== '0') {
                this.filterCupCupMatchesForm.patchValue({ active: 0 });
                this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: value }]);
            }
        });
    }

    resetCupCupMatchesFormFilters(): void {
        this.filterCupCupMatchesForm.reset({ active: 1 });
    }

    private getCupStages(selectedCompetitionId?: number): void {
        const competitionId = selectedCompetitionId
            ? selectedCompetitionId.toString()
            : this.filterCupCupMatchesForm.get('competition_id').value;
        this.cupStageService.getCupStages(null, null, null, competitionId).subscribe(
            response => {
                this.errorCupStages = null;
                if (response) {
                    this.competitionsCupStages[competitionId] = response.cup_stages.sort((a, b) => a.id - b.id);
                }
            },
            error => {
                this.competitionsCupStages[competitionId] = null;
                this.errorCupStages = error;
            }
        );
    }

    private getCompetitionsData(): void {
        this.competitionService
            .getCompetitions(null, environment.tournaments.cup.id, this.filterCupCupMatchesForm.get('season_id').value)
            .subscribe(
                response => {
                    this.errorCompetitions = null;
                    if (response) {
                        this.seasonsCompetitions[this.filterCupCupMatchesForm.get('season_id').value] = response.competitions;
                    }
                },
                error => {
                    this.seasonsCompetitions[this.filterCupCupMatchesForm.get('season_id').value] = null;
                    this.errorCompetitions = error;
                }
            );
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

    private prepareViewData(response: CupCupMatch[]): void {
        const allCupStages = response.map(item => item.cup_stage);
        this.cupStagesWithCupCupMatches = <CupStage[]>UtilsService.getDistinctItemsOfArray(allCupStages);
        const grouped = UtilsService.groupBy(response, cupCupMatch => cupCupMatch.cup_stage_id);
        this.cupStagesWithCupCupMatches.map(cupStage => {
            return (cupStage.cup_cup_matches = grouped.get(cupStage.id));
        });
        this.cupStagesWithCupCupMatches.forEach(cupStage => {
            if (!this.competitionsCupStages[cupStage.competition_id.toString()]) {
                this.getCupStages(cupStage.competition_id);
            }
            cupStage.cup_matches = cupStage.cup_cup_matches.map(cupCupMatch => {
                cupCupMatch.score = UtilsService.showScoresOrString(cupCupMatch.home, cupCupMatch.away, 'vs');
                return cupCupMatch;
            });
        });
    }
}
