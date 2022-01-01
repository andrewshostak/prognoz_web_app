import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CompetitionState } from '@enums/competition-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { TeamStageState } from '@enums/team-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { SeasonNew } from '@models/new/season-new.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
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

   public competitions: CompetitionNew[] = [];
   public selectedCompetitionId: number = null;
   public selectedTeamStage: TeamStageNew = null;
   public showTeamStageSelect = false;
   public teamStages: TeamStageNew[] = [];

   public competitionsBySeasonId: { [id: number]: CompetitionNew[] } = {};
   public seasons: SeasonNew[] = [];
   public teamStagesByCompetitionId: { [id: number]: TeamStageNew[] } = {};
   public teamStageSelectForm: FormGroup;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private currentStateService: CurrentStateService,
      private seasonService: SeasonNewService,
      private teamStageService: TeamStageNewService
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

   public clickOnCompetitionButton(competition: CompetitionNew): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.getTeamStagesObservable(competition.id)
         .pipe(first())
         .subscribe((response: PaginatedResponse<TeamStageNew>) => {
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

   private getActiveCompetitions(): Observable<PaginatedResponse<CompetitionNew>> {
      const search: CompetitionSearch = {
         limit: SettingsService.maxLimitValues.competitions,
         page: 1,
         states: [CompetitionState.Applications, CompetitionState.Active],
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

   private getCompetitionsObservable(): Observable<PaginatedResponse<CompetitionNew>> {
      return this.getActiveCompetitions().pipe(
         mergeMap(response => iif(() => !!response.total, of(response), this.getEndedCompetitions()))
      );
   }

   private getEndedCompetitions(): Observable<PaginatedResponse<CompetitionNew>> {
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

   private getSiblingTeamStagesObservable(teamStageId: number): Observable<PaginatedResponse<TeamStageNew>> {
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

   private getTeamStageSelectFormGroup(): FormGroup {
      return new FormGroup({
         season_id: new FormControl(null),
         competition_id: new FormControl(null),
         team_stage_id: new FormControl(null)
      });
   }

   private getSeasonsObservable(): Observable<PaginatedResponse<SeasonNew>> {
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

   private emitTeamStageSelect(teamStages: TeamStageNew[]): void {
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

   private setSelectedCompetitionId(response: PaginatedResponse<TeamStageNew>): void {
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
               .subscribe((response: PaginatedResponse<TeamStageNew>) => {
                  this.teamStages = response.data;
                  this.setSelectedCompetitionId(response);
                  this.selectedTeamStage = find(this.teamStages, { id: parseInt(params.team_stage_id, 10) });
               });
         } else {
            this.selectedTeamStage = found as TeamStageNew;
         }
      });
   }
}
