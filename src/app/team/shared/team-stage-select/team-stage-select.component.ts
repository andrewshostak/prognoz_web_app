import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { SeasonNew } from '@models/new/season-new.model';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { SettingsService } from '@services/settings.service';
import { map } from 'rxjs/operators';

@Component({
   selector: 'app-team-stage-select',
   templateUrl: './team-stage-select.component.html',
   styleUrls: ['./team-stage-select.component.scss']
})
export class TeamStageSelectComponent implements OnInit {
   @Output() public teamStageSelected = new EventEmitter<{ teamStages: TeamStageNew[]; selected: TeamStageNew }>();

   public teamStageSelectForm: FormGroup;

   public competitionsBySeasonId: { [id: number]: CompetitionNew[] } = {};
   public seasons: SeasonNew[] = [];
   public teamStagesByCompetitionId: { [id: number]: TeamStageNew[] } = {};

   constructor(
      private competitionService: CompetitionNewService,
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

   public ngOnInit(): void {
      this.teamStageSelectForm = this.getTeamStageSelectFormGroup();
      this.getSeasonsData();
      this.subscribeToFormValueChanges();
   }

   public submit(): void {
      const teamStages = this.teamStagesByCompetitionId[this.competitionIdFormValue];
      const selected = teamStages.find(teamStage => teamStage.id === this.teamStageIdFormValue);
      if (selected) {
         this.teamStageSelected.emit({ teamStages, selected });
      }
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

   private getTeamStageSelectFormGroup(): FormGroup {
      return new FormGroup({
         season_id: new FormControl(null),
         competition_id: new FormControl(null),
         team_stage_id: new FormControl(null)
      });
   }

   private getSeasonsData(): void {
      const search: SeasonSearch = {
         limit: SettingsService.maxLimitValues.seasons,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending
      };
      this.seasonService.getSeasons(search).subscribe(response => (this.seasons = response.data));
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
}
