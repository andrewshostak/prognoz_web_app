import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { environment } from '@env';

@Component({
    selector: 'app-championship-match-predictable',
    templateUrl: './championship-match-predictable.component.html',
    styleUrls: ['./championship-match-predictable.component.scss']
})
export class ChampionshipMatchPredictableComponent implements OnChanges {
    @Input() match: ChampionshipMatch;
    @Input() authenticatedUser: any;
    @Input() championshipPredictsForm: FormGroup;

    constructor(private championshipMatchService: ChampionshipMatchService, private changeDetectorRef: ChangeDetectorRef) {}

    clubsImagesUrl: string = environment.apiImageClubs;
    errorStatistic: string | Array<string>;
    isCollapsed = true;
    resultChartData: any;
    resultChartLabels: any;
    resultChartType = 'doughnut';
    spinnerStatistic = false;
    statistic: any = false;

    getChampionshipMatchStatisticData(match: ChampionshipMatch, forceUpdate: boolean = false) {
        if (this.isCollapsed || forceUpdate) {
            this.spinnerStatistic = true;
            this.championshipMatchService.getChampionshipMatch(match.id, [{ parameter: 'statistic', value: 'true' }]).subscribe(
                response => {
                    this.resultChartLabels = [match.club_first.title, match.club_second.title, 'Нічия'];
                    this.resultChartData = [response.results.home, response.results.away, response.results.draw];
                    this.statistic = response;
                    this.spinnerStatistic = false;
                    this.changeDetectorRef.detectChanges();
                },
                error => {
                    this.errorStatistic = error;
                    this.spinnerStatistic = false;
                }
            );
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (const propName in changes) {
            if (!changes[propName].firstChange && propName === 'match') {
                if (!this.isCollapsed) {
                    this.getChampionshipMatchStatisticData(changes[propName].currentValue, true);
                }
            }
        }
    }
}
