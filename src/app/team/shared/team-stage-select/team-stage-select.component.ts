import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { Season } from '@models/v2/season.model';
import { TeamParticipant } from '@models/v2/team/team-participant.model';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { User } from '@models/v2/user.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { TeamParticipantSearch } from '@models/search/team/team-participant-search.model';
import { TeamStageSearch } from '@models/search/team/team-stage-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionService } from '@services/api/v2/competition.service';
import { SeasonService } from '@services/api/v2/season.service';
import { TeamParticipantService } from '@services/api/v2/team/team-participant.service';
import { TeamStageService } from '@services/api/v2/team/team-stage.service';
import { PaginationService } from '@services/pagination.service';
import { UtilsService } from '@services/utils.service';
import { find, findLast, get } from 'lodash';
import { defer, iif, Observable, of } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-team-stage-select',
   templateUrl: './team-stage-select.component.html',
   styleUrls: ['./team-stage-select.component.scss']
})
export class TeamStageSelectComponent implements OnInit {
   @Input() public findCurrentCompetition: boolean = false;
   @Output() public teamStageSelected = new EventEmitter<{ teamStageId: number }>();

   public authenticatedUser: User;
   public competitions: Competition[] = [];
   public selectedCompetitionId: number = null;
   public selectedTeamStage: TeamStage = null;
   public showTeamStageSelect = false;
   public teamStages: TeamStage[] = [];

   public competitionsBySeasonId: { [id: number]: Competition[] } = {};
   public seasons: Season[] = [];
   public teamStagesByCompetitionId: { [id: number]: TeamStage[] } = {};
   public teamStageSelectForm: FormGroup;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private currentStateService: CurrentStateService,
      private seasonService: SeasonService,
      private teamParticipantService: TeamParticipantService,
      private teamStageService: TeamStageService
   ) {}

   get competitionIdFormValue(): number {
      const value = this.teamStageSelectForm.get('competition_id').value;
      return value ? parseInt(value, 10) : null;
   }

   get seasonIdFormValue(): number {
      const value = this.teamStageSelectForm.get('season_id').value;
      return value ? parseInt(value, 10) : null;
   }

   get teamStageIdFormValue(): number {
      const value = this.teamStageSelectForm.get('team_stage_id').value;
      return value ? parseInt(value, 10) : null;
   }

   public clickOnCompetitionButton(competition: Competition): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.getTeamStagesObservable(competition.id)
         .pipe(first())
         .subscribe((response: PaginatedResponse<TeamStage>) => {
            this.teamStages = response.data;
            this.emitTeamStageSelect(this.teamStages);
         });
      this.currentStateService.teamCompetitionId = competition.id;
      this.selectedCompetitionId = competition.id;
   }

   public ngOnInit(): void {
      this.teamStageSelectForm = this.getTeamStageSelectFormGroup();
      this.subscribeToFormValueChanges();
      this.initializeComponentData();
   }

   public submit(): void {
      const teamStages = this.teamStagesByCompetitionId[this.competitionIdFormValue];
      const selected = teamStages.find(teamStage => teamStage.id === this.teamStageIdFormValue);
      if (selected) {
         this.teamStageSelected.emit({ teamStageId: selected.id });
      }
   }

   private getActiveCompetitions(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: PaginationService.limit.competitions,
         page: 1,
         orderBy: 'id',
         sequence: Sequence.Ascending,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Team
      };
      return this.competitionService.getCompetitions(search);
   }

   private getCompetitionsData(seasonId: number): void {
      const search: CompetitionSearch = {
         limit: PaginationService.limit.competitions,
         page: 1,
         seasonId,
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitionsBySeasonId[seasonId] = response.data;
      });
   }

   private getCompetitionsObservable(): Observable<PaginatedResponse<Competition>> {
      if (this.sendTeamParticipantRequest()) {
         return this.getCurrentTeamParticipantObservable(this.authenticatedUser.id).pipe(mergeMap(response =>
            iif(
               () => !!response.length,
               defer(() => of({ data: [response[0].competition] } as PaginatedResponse<Competition>)),
               this.getNonCurrentCompetitionsObservable()
            )
         ));
      }

      return this.getNonCurrentCompetitionsObservable();
   }

   private getNonCurrentCompetitionsObservable(): Observable<PaginatedResponse<Competition>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
   }

   private getCurrentTeamParticipantObservable(userId: number): Observable<TeamParticipant[]> {
      const search: TeamParticipantSearch = {
         userId: userId,
         confirmed: ModelStatus.Truthy,
         ended: ModelStatus.Falsy,
         limit: 1,
         page: 1
      };
      return this.teamParticipantService.getTeamParticipants(search).pipe(map(response => response.data));
   }

   private getEndedCompetitions(): Observable<PaginatedResponse<Competition>> {
      const search: CompetitionSearch = {
         limit: 3,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending,
         states: [CompetitionState.Ended],
         tournamentId: Tournament.Team
      };
      return this.competitionService.getCompetitions(search);
   }

   private getSiblingTeamStagesObservable(teamStageId: number): Observable<PaginatedResponse<TeamStage>> {
      return this.teamStageService
         .getTeamStage(teamStageId, [])
         .pipe(mergeMap(response => this.getTeamStagesObservable(response.competition_id)));
   }

   private getTeamStagesData(competitionId: number): void {
      const search: TeamStageSearch = {
         competitionId,
         page: 1,
         limit: PaginationService.limit.teamStages,
         orderBy: 'id',
         sequence: Sequence.Ascending
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStagesByCompetitionId[competitionId] = response.data;
      });
   }

   private getTeamStagesObservable(competitionId: number): Observable<PaginatedResponse<TeamStage>> {
      const search: TeamStageSearch = {
         orderBy: 'id',
         sequence: Sequence.Ascending,
         page: 1,
         competitionId,
         limit: PaginationService.limit.teamStages
      };
      return this.teamStageService.getTeamStages(search);
   }

   private getTeamStageSelectFormGroup(): FormGroup {
      return new FormGroup({
         season_id: new FormControl(null),
         competition_id: new FormControl(null),
         team_stage_id: new FormControl(null)
      });
   }

   private getSeasonsObservable(): Observable<PaginatedResponse<Season>> {
      const search: SeasonSearch = {
         limit: PaginationService.limit.seasons,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending
      };
      return this.seasonService.getSeasons(search);
   }

   private formValueCompetitionIdChanged(competitionId: number): void {
      this.teamStageSelectForm.get('team_stage_id').reset();
      if (competitionId && !this.teamStagesByCompetitionId[competitionId]) {
         this.getTeamStagesData(competitionId);
      }
   }

   private formValueSeasonIdChanged(seasonId: number): void {
      this.teamStageSelectForm.get('competition_id').reset();
      if (seasonId && !this.competitionsBySeasonId[seasonId]) {
         this.getCompetitionsData(seasonId);
         this.selectedCompetitionId = this.competitionsBySeasonId[seasonId]?.length ? this.selectedCompetitionId : null;
      }
   }

   private initializeComponentData(): void {
      this.authenticatedUser = this.currentStateService.getUser();
      this.getCompetitionsObservable()
         .pipe(
            tap(response => (this.competitions = response.data)),
            mergeMap(response =>
               iif(
                  () => this.activatedRoute.snapshot.params.team_stage_id,
                  this.getSiblingTeamStagesObservable(this.activatedRoute.snapshot.params.team_stage_id),
                  this.getTeamStagesObservable(
                     UtilsService.getCompetitionID(response.data, this.currentStateService.teamCompetitionId)
                  )
               )
            ),
            tap(response => {
               this.teamStages = response.data;
               this.setSelectedCompetitionId(response);

               this.subscribeToTeamStageIdUrlParamChange();
               if (!this.activatedRoute.snapshot.params.team_stage_id) {
                  this.emitTeamStageSelect(this.teamStages);
               } else {
                  this.selectedTeamStage = find(this.teamStages, { id: parseInt(this.activatedRoute.snapshot.params.team_stage_id, 10) });
               }
            })
         )
         .subscribe();

      this.getSeasonsObservable()
         .pipe(tap(response => (this.seasons = response.data)))
         .subscribe();
   }

   private emitTeamStageSelect(teamStages: TeamStage[]): void {
      if (!teamStages.length) {
         return;
      }

      const active = teamStages.find(teamStage => teamStage.state === TeamStageState.Active);
      if (active) {
         this.teamStageSelected.emit({ teamStageId: active.id });
         return;
      }

      const notStarted = teamStages.find(teamStage => teamStage.state === TeamStageState.NotStarted);
      if (notStarted) {
         this.teamStageSelected.emit({ teamStageId: notStarted.id });
         return;
      }

      const ended = findLast(teamStages, teamStage => teamStage.state === TeamStageState.Ended);
      if (ended) {
         this.teamStageSelected.emit({ teamStageId: ended.id });
         return;
      }

      this.teamStageSelected.emit({ teamStageId: teamStages[0].id });
   }

   private sendTeamParticipantRequest(): boolean {
      return !!this.authenticatedUser && this.findCurrentCompetition;
   }

   private setSelectedCompetitionId(response: PaginatedResponse<TeamStage>): void {
      const competitionId = get(response, 'data[0].competition_id');
      if (!competitionId) {
         return;
      }
      if (this.competitions.map(c => c.id).includes(competitionId)) {
         this.selectedCompetitionId = competitionId;
      }
   }

   private subscribeToFormValueChanges(): void {
      this.teamStageSelectForm
         .get('season_id')
         .valueChanges.pipe(map(value => parseInt(value, 10)))
         .subscribe(value => {
            this.formValueSeasonIdChanged(value);
         });

      this.teamStageSelectForm
         .get('competition_id')
         .valueChanges.pipe(map(value => parseInt(value, 10)))
         .subscribe(value => {
            this.formValueCompetitionIdChanged(value);
         });
   }

   private subscribeToTeamStageIdUrlParamChange(): void {
      this.activatedRoute.params.pipe(filter(value => value.team_stage_id)).subscribe(params => {
         const found = find(this.teamStages, { id: parseInt(params.team_stage_id, 10) });

         // back browser navigation to team stage from different competition
         if (!found) {
            this.getSiblingTeamStagesObservable(params.team_stage_id)
               .pipe(first())
               .subscribe((response: PaginatedResponse<TeamStage>) => {
                  this.teamStages = response.data;
                  this.setSelectedCompetitionId(response);
                  this.selectedTeamStage = find(this.teamStages, { id: parseInt(params.team_stage_id, 10) });
               });
         } else {
            this.selectedTeamStage = found as TeamStage;
         }
      });
   }
}
