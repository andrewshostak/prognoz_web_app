import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ChampionshipMatchNew } from '@models/new/championship-match-new.model';
import { User } from '@models/user.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-championship-match-predictable',
   styleUrls: ['./championship-match-predictable.component.scss'],
   templateUrl: './championship-match-predictable.component.html'
})
export class ChampionshipMatchPredictableComponent implements OnChanges, OnInit {
   @Input() public championshipMatch: ChampionshipMatchNew;
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

   constructor(private championshipMatchService: ChampionshipMatchService, private changeDetectorRef: ChangeDetectorRef) {}

   public getChampionshipMatchStatisticData(championshipMatch: ChampionshipMatchNew, forceUpdate: boolean = false): void {
      if (this.isCollapsed || forceUpdate) {
         this.spinnerStatistic = true;
         this.championshipMatchService.getChampionshipMatch(championshipMatch.id, [{ parameter: 'statistic', value: 'true' }]).subscribe(
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
