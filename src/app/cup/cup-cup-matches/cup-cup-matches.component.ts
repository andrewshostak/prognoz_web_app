import { Component, OnDestroy, OnInit }   from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CupCupMatch } from '../../shared/models/cup-cup-match.model';
import { CupCupMatchService } from '../../core/services/cup/cup-cup-match.service';
import { CupStage } from '../../shared/models/cup-stage.model';
import { environment } from '../../../environments/environment';
import { HelperService } from '../../core/helper.service';
import { Subscription } from 'rxjs/Subscription';
import { TitleService } from '../../core/title.service';

@Component({
  selector: 'app-cup-cup-matches',
  templateUrl: './cup-cup-matches.component.html',
  styleUrls: ['./cup-cup-matches.component.css']
})
export class CupCupMatchesComponent implements OnInit, OnDestroy {

    constructor(
        private activatedRoute: ActivatedRoute,
        private cupCupMatchService: CupCupMatchService,
        public helperService: HelperService,
        private titleService: TitleService,
        private router: Router
    ) { }

    activatedRouteSubscription: Subscription;
    cupStagesWithCupMatches: CupStage[];
    errorCupCupMatches: string;
    userImageDefault: string;
    userImagesUrl: string;

    ngOnDestroy() {
        if (!this.activatedRouteSubscription.closed) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Матчі - Кубок');
        this.userImageDefault = environment.imageUserDefault;
        this.userImagesUrl = environment.apiImageUsers;
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
            this.cupCupMatchService.getCupCupMatches(params.active).subscribe(
                response => {
                    this.errorCupCupMatches = null;
                    const allCupStages = response.map((item) => item.cup_stage);
                    this.cupStagesWithCupMatches = <CupStage[]>this.helperService.getDistinctItems(allCupStages);
                    const grouped = this.helperService.groupBy(response, cupCupMatch => cupCupMatch.cup_stage_id);
                    this.cupStagesWithCupMatches.map((cupStage) => {
                        return cupStage.cup_cup_matches = grouped.get(cupStage.id);
                    });
                },
                error => {
                    this.cupStagesWithCupMatches = null;
                    this.errorCupCupMatches = error;
                }
            );
        });
    }
}
