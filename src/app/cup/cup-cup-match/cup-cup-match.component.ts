import { Component, ElementRef, OnDestroy, OnInit, ViewChild }  from '@angular/core';
import { ActivatedRoute, Params }                               from '@angular/router';

import { CupCupMatch }                  from '../../shared/models/cup-cup-match.model';
import { CupCupMatchService }           from '../../core/services/cup/cup-cup-match.service';
import { CupMatch }                     from '../../shared/models/cup-match.model';
import { CupMatchService }              from '../../core/services/cup/cup-match.service';
import { CupPrediction }                from '../../shared/models/cup-prediction.model';
import { CupPredictionService }         from '../../core/services/cup/cup-prediction.service';
import { environment }                  from '../../../environments/environment';
import { forkJoin }                     from 'rxjs/observable/forkJoin';
import { HelperService }                from '../../core/helper.service';
import { Subscription }                 from 'rxjs/Subscription';
import { TimePipe }                     from '../../shared/pipes/time.pipe';
import { TitleService }                 from '../../core/title.service';

declare const $: any;

@Component({
  selector: 'app-cup-cup-match',
  templateUrl: './cup-cup-match.component.html',
  styleUrls: ['./cup-cup-match.component.css']
})
export class CupCupMatchComponent implements OnDestroy, OnInit {

    constructor(
        private activatedRoute: ActivatedRoute,
        private cupCupMatchService: CupCupMatchService,
        private cupMatchService: CupMatchService,
        private cupPredictionService: CupPredictionService,
        private helperService: HelperService,
        private timePipe: TimePipe,
        private titleService: TitleService
    ) { }

    @ViewChild('cupCupMatchElement') cupCupMatchElement: ElementRef;

    activatedRouteSubscription: Subscription;
    clubsImagesUrl: string;
    cupCupMatch: CupCupMatch;
    cupMatches: CupMatch[];
    errorCupCupMatch: string;
    errorCupMatches: string;
    errorCupPredictions: string;
    userImageDefault: string;
    userImagesUrl: string;

    getCupPrediction(cupMatch: CupMatch, cupPrediction: CupPrediction): string {
        if (cupMatch.is_predictable) {
            return '?';
        }
        if (cupPrediction) {
            return this.helperService.showScore(cupPrediction.home, cupPrediction.away, '-');
        }
        return '-';
    }

    getCupPredictionTime(cupMatch: CupMatch, cupPrediction: CupPrediction): string {
        if (cupMatch.is_predictable) {
            return 'Прогнози гравців відображаються після початку другого тайму матчу';
        }
        if (cupPrediction) {
            const date = this.timePipe.transform(cupPrediction.updated_at, 'YYYY-MM-DD HH:mm');
            return 'Прогноз зроблено ' + date;
        }
        return 'Прогноз не зроблено';
    }

    isCupMatchGuessed(cupMatch: CupMatch, prediction: string): boolean {
        if (cupMatch.is_predictable || cupMatch.active || prediction === '-') {
            return false;
        }
        return this.showScore(cupMatch) === prediction;
    }

    ngOnDestroy() {
        $('[data-toggle="tooltip"]').tooltip('dispose');
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.clubsImagesUrl = environment.apiImageClubs;
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupCupMatchService.getCupCupMatch(params['cupCupMatchId']).subscribe(
                response => {
                    this.cupCupMatch = response;
                    this.cupCupMatch.score = this.helperService.showScore(this.cupCupMatch.home, this.cupCupMatch.away, 'vs');
                    this.titleService.setTitle(`${response.home_user.name} vs ${response.away_user.name} - Кубок`);
                    this.errorCupCupMatch = null;
                    this.getCupMatchesData(this.cupCupMatch.cup_stage_id);
                },
                error => {
                    this.cupCupMatch = null;
                    this.errorCupCupMatch = error;
                }
            );
        });
    }

    showScore(cupMatch: CupMatch): string {
        return this.helperService.showScore(cupMatch.home, cupMatch.away, 'vs');
    }

    private getCupMatchesData(cupStageId: number): void {
        this.cupMatchService.getCupMatches(
            null,
            null,
            null,
            null,
            null,
            cupStageId
        ).subscribe(
            response => {
                this.errorCupMatches = null;
                if (response && response.cup_matches) {
                    this.cupMatches = response.cup_matches;
                    const cupPredictionsHome = this.cupPredictionService
                        .getCupPredictions(this.cupCupMatch.id, this.cupCupMatch.home_user_id);
                    const cupPredictionsAway = this.cupPredictionService
                        .getCupPredictions(this.cupCupMatch.id, this.cupCupMatch.away_user_id);

                    forkJoin([cupPredictionsHome, cupPredictionsAway], (home, away) => {
                        return { home, away };
                    }).subscribe(
                        r => {
                            this.errorCupPredictions = null;
                            this.cupMatches = this.cupMatches.map((cupMatch) => {
                                const homePrediction = r.home ? r.home.find((prediction) => prediction.cup_match_id === cupMatch.id) : null;
                                const awayPrediction = r.away ? r.away.find((prediction) => prediction.cup_match_id === cupMatch.id) : null;
                                cupMatch.home_prediction = this.getCupPrediction(cupMatch, homePrediction);
                                cupMatch.away_prediction = this.getCupPrediction(cupMatch, awayPrediction);
                                cupMatch.home_prediction_created_at = this.getCupPredictionTime(cupMatch, homePrediction);
                                cupMatch.away_prediction_created_at = this.getCupPredictionTime(cupMatch, awayPrediction);
                                return cupMatch;
                            });
                            $(() => $('[data-toggle="tooltip"]').tooltip());
                        },
                        error => this.errorCupPredictions = error
                    );
                }
            },
            error => {
                this.cupMatches = null;
                this.errorCupMatches = error;
            }
        );
    }
}
