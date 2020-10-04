import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupCupMatchNew } from '@models/new/cup-cup-match-new.model';
import { CupStageNew } from '@models/new/cup-stage-new';
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
import { iif, Observable, of } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-cup-cup-matches-new',
   templateUrl: './cup-cup-matches-new.component.html',
   styleUrls: ['./cup-cup-matches-new.component.scss']
})
export class CupCupMatchesNewComponent implements OnInit {
   public competitions: CompetitionNew[] = [];
   public cupCupMatches: CupCupMatchNew[] = [];
   public cupStages: CupStageNew[] = [];
   public selectedCompetitionId: number = null;
   public showCupStageSelect: boolean = false;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private cupCupMatchService: CupCupMatchNewService,
      private cupStageService: CupStageNewService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private titleService: TitleService
   ) {}

   get selectedCupStageId(): number {
      return parseInt(this.activatedRoute.snapshot.params.cup_stage_id, 10);
   }

   public clickOnCupStageSelectButton(event: { cupStages: CupStageNew[]; selected: CupStageNew }): void {
      this.cupStages = event.cupStages;
      this.selectedCompetitionId = event.selected.competition_id;
      this.router.navigate(['/cup', 'cup-matches-new', { cup_stage_id: event.selected.id }]);
   }

   public clickOnCompetitionButton(competition: CompetitionNew): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.getCupStagesObservable(competition.id).subscribe(response => {
         this.cupStages = response.data;
         this.navigateToCupStage(this.cupStages);
      });
      this.currentStateService.cupCompetitionId = competition.id;
      this.selectedCompetitionId = competition.id;
   }

   public ngOnInit() {
      this.titleService.setTitle('Матчі - Кубок');
      this.initializePageData();
      this.subscribeToCupStageIdUrlParamChange();
   }

   public toggleCupStageSelect(): void {
      this.showCupStageSelect = !this.showCupStageSelect;
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
         active: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         tournamentId: Tournament.Cup
      };
      return this.competitionService.getCompetitions(search);
   }

   private getCompetitionsObservable(): Observable<PaginatedResponse<CompetitionNew>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
   }

   private getCupCupMatchesObservable(cupStageId: number): Observable<PaginatedResponse<CupCupMatchNew>> {
      const search: CupCupMatchSearch = { page: 1, cupStageId, limit: SettingsService.maxLimitValues.cupCupMatches };
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
         ended: ModelStatus.Truthy,
         limit: 2,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending,
         tournamentId: Tournament.Cup
      };
      return this.competitionService.getCompetitions(search);
   }

   private getSiblingCupStagesObservable(cupStageId: number): Observable<PaginatedResponse<CupStageNew>> {
      return this.cupStageService.getCupStage(cupStageId).pipe(mergeMap(response => this.getCupStagesObservable(response.competition_id)));
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
               if (this.competitions.map(c => c.id).includes(response.data[0].competition_id)) {
                  this.selectedCompetitionId = response.data[0].competition_id;
               }

               if (!this.activatedRoute.snapshot.params.cup_stage_id) {
                  this.navigateToCupStage(this.cupStages);
               }
            })
         )
         .subscribe();
   }

   private navigateToCupStage(cupStages: CupStageNew[]): void {
      if (!cupStages.length) {
         return;
      }

      const active = cupStages.find(cupStage => cupStage.active);
      if (active) {
         this.router.navigate(['/cup', 'cup-matches-new', { cup_stage_id: active.id }]);
         return;
      }

      const ended = cupStages.find(cupStage => cupStage.ended);
      if (ended) {
         this.router.navigate(['/cup', 'cup-matches-new', { cup_stage_id: ended.id }]);
         return;
      }

      this.router.navigate(['/cup', 'cup-matches-new', { cup_Stage_id: cupStages[0].id }]);
   }

   private subscribeToCupStageIdUrlParamChange(): void {
      this.activatedRoute.params.pipe(filter(value => value.cup_stage_id)).subscribe(params => {
         this.getCupCupMatchesObservable(params.cup_stage_id).subscribe(response => {
            this.cupCupMatches = response.data;
         });
      });
   }
}
