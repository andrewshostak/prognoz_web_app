import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { Season } from '@models/v2/season.model';
import { TeamStage } from '@models/v2/team/team-stage.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { TeamStageSearch } from '@models/search/team/team-stage-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionService } from '@services/v2/competition.service';
import { SeasonService } from '@services/v2/season.service';
import { TeamStageService } from '@services/v2/team/team-stage.service';
import { SettingsService } from '@services/settings.service';
import { find, findLast, get } from 'lodash';
import { iif, Observable, of } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-team-stage-select',
   templateUrl: './team-stage-select.component.html',
   styleUrls: ['./team-stage-select.component.scss']
})
export class TeamStageSelectComponent implements OnInit {
   @Output() public teamStageSelected = new EventEmitter<{ teamStageId: number }>();

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
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         states: [CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Team
      };
      return this.competitionService.getCompetitions(search);
   }

   // TODO: same as in cup-cup-matches
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

   private getCompetitionsData(seasonId: number): void {
      const search: CompetitionSearch = {
         limit: SettingsService.maxLimitValues.seasons,
         page: 1,
         seasonId,
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitionsBySeasonId[seasonId] = response.data;
      });
   }

   private getCompetitionsObservable(): Observable<PaginatedResponse<Competition>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
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
         limit: SettingsService.maxLimitValues.teamStages,
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
         limit: SettingsService.maxLimitValues.teamStages
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
         limit: SettingsService.maxLimitValues.seasons,
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

   private formValueSeasonIdChanged(competitionId: number): void {
      this.teamStageSelectForm.get('competition_id').reset();
      if (competitionId && !this.competitionsBySeasonId[competitionId]) {
         this.getCompetitionsData(competitionId);
      }
   }

   private initializeComponentData(): void {
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
