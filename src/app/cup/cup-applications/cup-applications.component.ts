import { Component, OnInit } from '@angular/core';

import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { CupApplication } from '@models/v2/cup/cup-application.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupApplicationSearch } from '@models/search/cup-application-search.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CupApplicationNewService } from '@services/new/cup-application-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { get } from 'lodash';
import { of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-cup-applications',
   templateUrl: './cup-applications.component.html',
   styleUrls: ['./cup-applications.component.scss']
})
export class CupApplicationsComponent implements OnInit {
   competitions: Competition[];
   cupApplications: CupApplication[] = [];
   selectedCompetition: Competition;

   constructor(
      private competitionService: CompetitionNewService,
      private cupApplicationNewService: CupApplicationNewService,
      private titleService: TitleService
   ) {}

   getApplicationsAndCompetitions(): void {
      const competitionSearch: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         orderBy: 'id',
         sequence: Sequence.Ascending,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Cup
      };
      const applicationsSearch: CupApplicationSearch = {
         page: 1,
         orderBy: 'points',
         sequence: Sequence.Descending,
         limit: SettingsService.maxLimitValues.cupApplications,
         relations: ['applicant']
      };
      this.competitionService
         .getCompetitions(competitionSearch)
         .pipe(
            tap(response => {
               this.competitions = response.data;
               this.cupApplications = [];
            }),
            mergeMap(response => {
               if (!response.data.length) {
                  return of({ data: [] });
               }

               if (!this.selectedCompetition) {
                  applicationsSearch.competitionId = response.data[0].id;
                  this.selectedCompetition = response.data[0];
               } else {
                  applicationsSearch.competitionId = this.selectedCompetition.id;
               }

               return this.cupApplicationNewService.getCupApplications(applicationsSearch);
            }),
            tap(response => (this.cupApplications = response.data))
         )
         .subscribe();
   }

   isFriendlyCupCompetition(competition: Competition): boolean {
      return get(competition, 'config.cup.is_friendly', false);
   }

   ngOnInit(): void {
      this.titleService.setTitle('Заявки / Учасники - Кубок');
      this.getApplicationsAndCompetitions();
   }

   onClick(competition: Competition): void {
      if (this.selectedCompetition.id === competition.id) {
         return;
      }

      this.cupApplications = [];
      this.selectedCompetition = competition;
      const applicationsSearch: CupApplicationSearch = {
         competitionId: competition.id,
         page: 1,
         orderBy: 'points',
         sequence: Sequence.Descending,
         limit: SettingsService.maxLimitValues.cupApplications,
         relations: ['applicant']
      };
      this.cupApplicationNewService.getCupApplications(applicationsSearch).subscribe(
         response => {
            this.cupApplications = response.data;
         },
         () => (this.cupApplications = [])
      );
   }
}
