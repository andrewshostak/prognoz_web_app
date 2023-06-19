import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CupStageState } from '@enums/cup-stage-state.enum';
import { CupStageType } from '@enums/cup-stage-type.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupCupMatchSearch } from '@models/search/cup/cup-cup-match-search.model';
import { CupStageSearch } from '@models/search/cup/cup-stage-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionService } from '@services/v2/competition.service';
import { CupCupMatchService } from '@services/v2/cup/cup-cup-match.service';
import { CupStageService } from '@services/v2/cup/cup-stage.service';
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
   public competitions: Competition[] = [];
   public cupCupMatches: CupCupMatch[] = [];
   public cupCupMatchesOfFirstStage: CupCupMatch[] = [];
   public cupStages: CupStage[] = [];
   public selectedCompetitionId: number = null;
   public selectedCupStage: CupStage = null;
   public showCupStageSelect: boolean = false;
   public cupStageTypes = CupStageType;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private cupCupMatchService: CupCupMatchService,
      private cupStageService: CupStageService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private titleService: TitleService
   ) {}

   public clickOnCupStageSelectButton(event: { cupStages: CupStage[]; selected: CupStage }): void {
      this.cupStages = event.cupStages;
      this.selectedCompetitionId = event.selected.competition_id;
      this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: event.selected.id }]);
   }

   public clickOnCompetitionButton(competition: Competition): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.getCupStagesObservable(competition.id)
         .pipe(first())
         .subscribe((response: PaginatedResponse<CupStage>) => {
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

   private findPreviousCupStage(cupStages: CupStage[], selectedCupStage: CupStage): CupStage {
      return findLast(cupStages, (cupStage: CupStage) => {
         return (
            cupStage.round === 1 && cupStage.cup_stage_type_id === selectedCupStage.cup_stage_type_id && cupStage.id < selectedCupStage.id
         );
      });
   }

   private getCompetitionIdForDownloadingStages(competitions: Competition[], selectedCompetitionId: number): number {
      if (!competitions.length && !selectedCompetitionId) {
         return null;
      }

      if (!selectedCompetitionId) {
         return competitions[0].id;
      }

      const ids = competitions.map(competition => competition.id);
      return ids.includes(selectedCompetitionId) ? selectedCompetitionId : competitions[0].id;
   }

   private getActiveCompetitions(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Cup
      };
      return this.competitionService.getCompetitions(search);
   }

   private getCompetitionsObservable(): Observable<PaginatedResponse<Competition>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
   }

   private getCupCupMatchesObservable(cupStageId: number, includeRelations: boolean): Observable<PaginatedResponse<CupCupMatch>> {
      const search: CupCupMatchSearch = {
         page: 1,
         cupStageId,
         cupPredictionsCount: true,
         relations: includeRelations ? ['homeUser', 'awayUser'] : [],
         limit: SettingsService.maxLimitValues.cupCupMatches
      };
      return this.cupCupMatchService.getCupCupMatches(search);
   }

   private getCupStagesObservable(competitionId: number): Observable<PaginatedResponse<CupStage>> {
      const search: CupStageSearch = {
         orderBy: 'id',
         sequence: Sequence.Ascending,
         page: 1,
         competitionId,
         limit: SettingsService.maxLimitValues.cupStages
      };
      return this.cupStageService.getCupStages(search);
   }

   private getEndedCompetitions(): Observable<PaginatedResponse<Competition>> {
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

   private getSiblingCupStagesObservable(cupStageId: number): Observable<PaginatedResponse<CupStage>> {
      return this.cupStageService.getCupStage(cupStageId).pipe(mergeMap(response => this.getCupStagesObservable(response.competition_id)));
   }

   private hasPreviousCupStage(cupStage: CupStage): boolean {
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

   private navigateToCupStage(cupStages: CupStage[]): void {
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

      const ended = findLast(cupStages, cupStage => cupStage.state === CupStageState.Ended) as CupStage;
      if (ended) {
         this.router.navigate(['/cup', 'cup-matches', { cup_stage_id: ended.id }]);
         return;
      }

      this.router.navigate(['/cup', 'cup-matches', { cup_Stage_id: cupStages[0].id }]);
   }

   private setSelectedCompetitionId(response: PaginatedResponse<CupStage>): void {
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
               .subscribe((response: PaginatedResponse<CupStage>) => {
                  this.cupStages = response.data;
                  this.setSelectedCompetitionId(response);
                  this.selectedCupStage = find(this.cupStages, { id: parseInt(params.cup_stage_id, 10) });
                  this.updateFirstStageCupCupMatches();
               });
         } else {
            this.selectedCupStage = found as CupStage;
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
