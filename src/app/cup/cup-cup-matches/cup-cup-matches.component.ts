import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CupStageState } from '@enums/cup-stage-state.enum';
import { CupStageType } from '@enums/cup-stage-type.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { CupStageNew } from '@models/new/cup-stage-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupCupMatchSearch } from '@models/search/cup-cup-match-search.model';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CupCupMatchNewService } from '@services/new/cup-cup-match-new.service';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { find, findLast, get } from 'lodash';
import { iif, Observable, of } from 'rxjs';
import { filter, first, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-cup-cup-matches',
   templateUrl: './cup-cup-matches.component.html',
   styleUrls: ['./cup-cup-matches.component.scss']
})
export class CupCupMatchesComponent implements OnInit {
   public competitions: CompetitionNew[] = [];
   public cupCupMatches: CupCupMatchNew[] = [];
   public cupCupMatchesOfFirstStage: CupCupMatchNew[] = [];
   public cupStages: CupStageNew[] = [];
   public selectedCompetitionId: number = null;
   public selectedCupStage: CupStageNew = null;
   public showCupStageSelect: boolean = false;
   public cupStageTypes = CupStageType;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private cupCupMatchService: CupCupMatchNewService,
      private cupStageService: CupStageNewService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public clickOnCupStageSelectButton(event: { cupStages: CupStageNew[]; selected: CupStageNew }): void {
      this.cupStages = event.cupStages;
      this.selectedCompetitionId = event.selected.competition_id;
      this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: event.selected.id }]);
   }

   public clickOnCompetitionButton(competition: CompetitionNew): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.getCupStagesObservable(competition.id)
         .pipe(first())
         .subscribe((response: PaginatedResponse<CupStageNew>) => {
            this.cupStages = response.data;
            this.navigateToCupStage(this.cupStages);
         });
      this.currentStateService.cupCompetitionId = competition.id;
      this.selectedCompetitionId = competition.id;
   }

   public ngOnInit() {
      this.titleService.setTitle('Матчі - Кубок');
      this.initializePageData();
   }

   public toggleCupStageSelect(): void {
      this.showCupStageSelect = !this.showCupStageSelect;
   }

   private findPreviousCupStage(cupStages: CupStageNew[], selectedCupStage: CupStageNew): CupStageNew {
      return findLast(cupStages, (cupStage: CupStageNew) => {
         return (
            cupStage.round === 1 && cupStage.cup_stage_type_id === selectedCupStage.cup_stage_type_id && cupStage.id < selectedCupStage.id
         );
      });
   }

   private getCompetitionIdForDownloadingStages(competitions: CompetitionNew[], selectedCompetitionId: number): number {
      if (!competitions.length && !selectedCompetitionId) {
         return null;
      }

      if (!selectedCompetitionId) {
         return competitions[0].id;
      }

      const ids = competitions.map(competition => competition.id);
      return ids.includes(selectedCompetitionId) ? selectedCompetitionId : competitions[0].id;
   }

   private getActiveCompetitions(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Cup
      };
      return this.competitionService.getCompetitions(search);
   }

   private getCompetitionsObservable(): Observable<PaginatedResponse<CompetitionNew>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
   }

   private getCupCupMatchesObservable(cupStageId: number, includeRelations: boolean): Observable<PaginatedResponse<CupCupMatchNew>> {
      const search: CupCupMatchSearch = {
         page: 1,
         cupStageId,
         cupPredictionsCount: true,
         relations: includeRelations ? ['homeUser', 'awayUser'] : [],
         limit: SettingsService.maxLimitValues.cupCupMatches
      };
      return this.cupCupMatchService.getCupCupMatches(search);
   }

   private getCupStagesObservable(competitionId: number): Observable<PaginatedResponse<CupStageNew>> {
      const search: CupStageSearch = {
         orderBy: 'id',
         sequence: Sequence.Ascending,
         page: 1,
         competitionId,
         limit: SettingsService.maxLimitValues.cupStages
      };
      return this.cupStageService.getCupStages(search);
   }

   private getEndedCompetitions(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         limit: 3,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending,
         states: [CompetitionState.Ended],
         tournamentId: Tournament.Cup
      };
      return this.competitionService.getCompetitions(search);
   }

   private getSiblingCupStagesObservable(cupStageId: number): Observable<PaginatedResponse<CupStageNew>> {
      return this.cupStageService.getCupStage(cupStageId).pipe(mergeMap(response => this.getCupStagesObservable(response.competition_id)));
   }

   private hasPreviousCupStage(cupStage: CupStageNew): boolean {
      const twoMatchCupStages = [CupStageType.Qualification, CupStageType.PlayOff, CupStageType.PlayOff2];
      return twoMatchCupStages.includes(cupStage.cup_stage_type_id) && cupStage.round === 2;
   }

   private initializePageData(): void {
      this.getCompetitionsObservable()
         .pipe(
            tap(response => (this.competitions = response.data)),
            mergeMap(response =>
               iif(
                  () => this.activatedRoute.snapshot.params.cup_stage_id,
                  this.getSiblingCupStagesObservable(this.activatedRoute.snapshot.params.cup_stage_id),
                  this.getCupStagesObservable(
                     this.getCompetitionIdForDownloadingStages(response.data, this.currentStateService.cupCompetitionId)
                  )
               )
            ),
            tap(response => {
               this.cupStages = response.data;
               this.setSelectedCompetitionId(response);

               this.subscribeToCupStageIdUrlParamChange();
               if (!this.activatedRoute.snapshot.params.cup_stage_id) {
                  this.navigateToCupStage(this.cupStages);
               } else {
                  this.selectedCupStage = find(this.cupStages, { id: parseInt(this.activatedRoute.snapshot.params.cup_stage_id, 10) });
               }
            })
         )
         .subscribe();
   }

   private navigateToCupStage(cupStages: CupStageNew[]): void {
      if (!cupStages.length) {
         return;
      }

      const active = cupStages.find(cupStage => cupStage.state === CupStageState.Active);
      if (active) {
         this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: active.id }]);
         return;
      }

      const notStarted = cupStages.find(cupStage => cupStage.state === CupStageState.NotStarted);
      if (notStarted) {
         this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: notStarted.id }]);
         return;
      }

      const ended = findLast(cupStages, cupStage => cupStage.state === CupStageState.Ended) as CupStageNew;
      if (ended) {
         this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: ended.id }]);
         return;
      }

      this.router.navigate(['/cup', 'cup-matches', { cup_Stage_id: cupStages[0].id }]);
   }

   private setSelectedCompetitionId(response: PaginatedResponse<CupStageNew>): void {
      const competitionId = get(response, 'data[0].competition_id');
      if (!competitionId) {
         return;
      }
      if (this.competitions.map(c => c.id).includes(competitionId)) {
         this.selectedCompetitionId = competitionId;
      }
   }

   private subscribeToCupStageIdUrlParamChange(): void {
      this.activatedRoute.params.pipe(filter(value => value.cup_stage_id)).subscribe(params => {
         const found = find(this.cupStages, { id: parseInt(params.cup_stage_id, 10) });

         // back browser navigation to cup stage from different competition
         if (!found) {
            this.getSiblingCupStagesObservable(params.cup_stage_id)
               .pipe(first())
               .subscribe((response: PaginatedResponse<CupStageNew>) => {
                  this.cupStages = response.data;
                  this.setSelectedCompetitionId(response);
                  this.selectedCupStage = find(this.cupStages, { id: parseInt(params.cup_stage_id, 10) });
                  this.updateFirstStageCupCupMatches();
               });
         } else {
            this.selectedCupStage = found as CupStageNew;
            this.updateFirstStageCupCupMatches();
         }

         this.getCupCupMatchesObservable(params.cup_stage_id, true).subscribe(response => {
            this.cupCupMatches = response.data;
         });
      });
   }

   private updateFirstStageCupCupMatches(): void {
      if (
         this.hasPreviousCupStage(this.selectedCupStage) &&
         (this.selectedCupStage.state === CupStageState.Active || this.selectedCupStage.state === CupStageState.Ended)
      ) {
         const previousCupStage = this.findPreviousCupStage(this.cupStages, this.selectedCupStage);
         this.getCupCupMatchesObservable(previousCupStage.id, false).subscribe(response => {
            this.cupCupMatchesOfFirstStage = response.data;
         });
      } else {
         this.cupCupMatchesOfFirstStage = [];
      }
   }
}
