import { Component, OnInit } from '@angular/core';

import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { CupApplication } from '@models/v2/cup/cup-application.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupApplicationSearch } from '@models/search/cup/cup-application-search.model';
import { CompetitionService } from '@services/api/v2/competition.service';
import { CupApplicationService } from '@services/api/v2/cup/cup-application.service';
import { CurrentStateService } from '@services/current-state.service';
import { PaginationService } from '@services/pagination.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';
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
      private competitionService: CompetitionService,
      private cupApplicationService: CupApplicationService,
      private currentStateService: CurrentStateService,
      private titleService: TitleService
   ) {}

   getApplicationsAndCompetitions(): void {
      const competitionSearch: CompetitionSearch = {
         page: 1,
         limit: PaginationService.limit.competitions,
         orderBy: 'id',
         sequence: Sequence.Ascending,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Cup
      };
      const applicationsSearch: CupApplicationSearch = {
         page: 1,
         orderBy: 'points',
         sequence: Sequence.Descending,
         limit: PaginationService.limit.cupApplications,
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

               // TODO: improve this code: modify func?
               if (!this.selectedCompetition) {
                  const selectedCompetitionID = UtilsService.getCompetitionID(response.data, this.currentStateService.cupCompetitionId);
                  applicationsSearch.competitionId = selectedCompetitionID; // TODO: think about null cases
                  this.selectedCompetition = response.data.find(competition => competition.id === selectedCompetitionID);
               } else {
                  applicationsSearch.competitionId = this.selectedCompetition.id;
                  const selectedCompetitionID = UtilsService.getCompetitionID(response.data, this.selectedCompetition.id);
                  this.selectedCompetition = response.data.find(competition => competition.id === selectedCompetitionID);
               }

               return this.cupApplicationService.getCupApplications(applicationsSearch);
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
         limit: PaginationService.limit.cupApplications,
         relations: ['applicant']
      };
      this.cupApplicationService.getCupApplications(applicationsSearch).subscribe(
         response => {
            this.cupApplications = response.data;
         },
         () => (this.cupApplications = [])
      );
      this.currentStateService.cupCompetitionId = competition.id;
   }

   // TODO: sort competitions
   // TODO: check old competition selection is not setting
   // TODO: manually set old competition id for cases when new 3 competitions are started
}
