import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { TeamTeamMatchSearch } from '@models/search/team-team-match-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { SettingsService } from '@services/settings.service';
import { find, findLast, get } from 'lodash';
import { iif, Observable, of } from 'rxjs';
import { filter, first, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-team-team-matches-new',
   templateUrl: './team-team-matches-new.component.html',
   styleUrls: ['./team-team-matches-new.component.scss']
})
export class TeamTeamMatchesNewComponent implements OnInit {
   public competitions: CompetitionNew[] = [];
   public selectedCompetitionId: number = null;
   public selectedTeamStage: TeamStageNew = null;
   public showTeamStageSelect: boolean = false;
   public teamStages: TeamStageNew[] = [];
   public teamTeamMatches: TeamTeamMatchNew[] = [];

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamStageService: TeamStageNewService,
      private teamTeamMatchService: TeamTeamMatchNewService
   ) {}

   public clickOnCompetitionButton(competition: CompetitionNew): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.getTeamStagesObservable(competition.id)
         .pipe(first())
         .subscribe((response: PaginatedResponse<TeamStageNew>) => {
            this.teamStages = response.data;
            this.navigateToTeamStage(this.teamStages);
         });
      this.currentStateService.cupCompetitionId = competition.id;
      this.selectedCompetitionId = competition.id;
   }

   public ngOnInit(): void {
      this.initializePageData();
   }

   private getActiveCompetitions(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         activeOrStated: ModelStatus.Truthy,
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         tournamentId: Tournament.Team
      };
      return this.competitionService.getCompetitions(search);
   }

   // todo: same as in cup-cup-matches
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

   private getCompetitionsObservable(): Observable<PaginatedResponse<CompetitionNew>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
   }

   private getEndedCompetitions(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         ended: ModelStatus.Truthy,
         limit: 3,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending,
         tournamentId: Tournament.Team
      };
      return this.competitionService.getCompetitions(search);
   }

   private getSiblingTeamStagesObservable(teamStageId: number): Observable<PaginatedResponse<TeamStageNew>> {
      return this.teamStageService
         .getTeamStage(teamStageId)
         .pipe(mergeMap(response => this.getTeamStagesObservable(response.competition_id)));
   }

   private getTeamStagesObservable(competitionId: number): Observable<PaginatedResponse<TeamStageNew>> {
      const search: TeamStageSearch = {
         orderBy: 'id',
         sequence: Sequence.Ascending,
         page: 1,
         competitionId,
         limit: SettingsService.maxLimitValues.teamStages
      };
      return this.teamStageService.getTeamStages(search);
   }

   private getTeamTeamMatchesObservable(teamStageId: number, includeRelations: boolean): Observable<PaginatedResponse<TeamTeamMatchNew>> {
      const search: TeamTeamMatchSearch = {
         page: 1,
         teamStageId,
         relations: includeRelations ? ['homeTeam', 'awayTeam', 'homeTeamGoalkeeper', 'awayTeamGoalkeeper'] : [],
         limit: SettingsService.maxLimitValues.teamTeamMatches
      };
      return this.teamTeamMatchService.getTeamTeamMatches(search);
   }

   private initializePageData(): void {
      this.getCompetitionsObservable()
         .pipe(
            tap(response => (this.competitions = response.data)),
            mergeMap(response =>
               iif(
                  () => this.activatedRoute.snapshot.params.team_stage_id,
                  this.getSiblingTeamStagesObservable(this.activatedRoute.snapshot.params.team_stage_id),
                  this.getTeamStagesObservable(
                     this.getCompetitionIdForDownloadingStages(response.data, this.currentStateService.teamCompetitionId)
                  )
               )
            ),
            tap(response => {
               this.teamStages = response.data;
               this.setSelectedCompetitionId(response);

               this.subscribeToTeamStageIdUrlParamChange();
               if (!this.activatedRoute.snapshot.params.team_stage_id) {
                  this.navigateToTeamStage(this.teamStages);
               } else {
                  this.selectedTeamStage = find(this.teamStages, { id: parseInt(this.activatedRoute.snapshot.params.team_stage_id, 10) });
               }
            })
         )
         .subscribe();
   }

   private navigateToTeamStage(teamStages: TeamStageNew[]): void {
      if (!teamStages.length) {
         return;
      }

      const active = teamStages.find(teamStage => teamStage.state === TeamStageState.Active);
      if (active) {
         this.router.navigate([{ team_stage_id: active.id }], { relativeTo: this.activatedRoute });
         return;
      }

      const notStarted = teamStages.find(teamStage => teamStage.state === TeamStageState.NotStarted);
      if (notStarted) {
         this.router.navigate([{ team_stage_id: notStarted.id }], { relativeTo: this.activatedRoute });
         return;
      }

      const ended = findLast(teamStages, teamStage => teamStage.state === TeamStageState.Ended);
      if (ended) {
         this.router.navigate([{ team_stage_id: ended.id }], { relativeTo: this.activatedRoute });
         return;
      }

      this.router.navigate([{ team_Stage_id: teamStages[0].id }], { relativeTo: this.activatedRoute });
   }

   private setSelectedCompetitionId(response: PaginatedResponse<TeamStageNew>): void {
      const competitionId = get(response, 'data[0].competition_id');
      if (!competitionId) {
         return;
      }
      if (this.competitions.map(c => c.id).includes(competitionId)) {
         this.selectedCompetitionId = competitionId;
      }
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params.pipe(filter(value => value.team_stage_id)).subscribe(params => {
         const found = find(this.teamStages, { id: parseInt(params.team_stage_id, 10) });

         // back browser navigation to team stage from different competition
         if (!found) {
            this.getSiblingTeamStagesObservable(params.team_stage_id)
               .pipe(first())
               .subscribe((response: PaginatedResponse<TeamStageNew>) => {
                  this.teamStages = response.data;
                  this.setSelectedCompetitionId(response);
                  this.selectedTeamStage = find(this.teamStages, { id: parseInt(params.team_stage_id, 10) });
               });
         } else {
            this.selectedTeamStage = found as TeamStageNew;
         }

         this.getTeamTeamMatchesObservable(params.team_stage_id, true).subscribe(response => {
            this.teamTeamMatches = response.data;
         });
      });
   }
}
