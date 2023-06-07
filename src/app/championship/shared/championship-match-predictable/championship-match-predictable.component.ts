import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { User } from '@models/v2/user.model';
import { ChampionshipMatchNewService } from '@services/new/championship-match-new.service';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-championship-match-predictable',
   styleUrls: ['./championship-match-predictable.component.scss'],
   templateUrl: './championship-match-predictable.component.html'
})
export class ChampionshipMatchPredictableComponent implements OnChanges, OnInit {
   @Input() public championshipMatch: ChampionshipMatch;
   @Input() public authenticatedUser: User;
   @Input() public championshipPredictsForm: FormGroup;

   public clubsLogosPath: string;
   public errorStatistic: string;
   public isCollapsed = true;
   public resultChartData: any;
   public resultChartLabels: any;
   public resultChartType = 'doughnut';
   public spinnerStatistic = false;
   public statistic: any = false;

   constructor(private championshipMatchService: ChampionshipMatchNewService, private changeDetectorRef: ChangeDetectorRef) {}

   public getChampionshipMatchStatisticData(championshipMatch: ChampionshipMatch, forceUpdate: boolean = false): void {
      if (this.isCollapsed || forceUpdate) {
         this.spinnerStatistic = true;
         this.championshipMatchService.getChampionshipMatchStatistic(championshipMatch.id).subscribe(
            response => {
               this.resultChartLabels = [championshipMatch.match.club_home.title, championshipMatch.match.club_away.title, 'Нічия'];
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

   public ngOnChanges(changes: SimpleChanges): void {
      for (const propName in changes) {
         if (!changes[propName].firstChange && propName === 'match') {
            if (!this.isCollapsed) {
               this.getChampionshipMatchStatisticData(changes[propName].currentValue, true);
            }
         }
      }
   }

   public ngOnInit(): void {
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
   }
}
