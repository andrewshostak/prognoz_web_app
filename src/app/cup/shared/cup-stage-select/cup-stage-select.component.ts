import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { Competition } from '@models/v2/competition.model';
import { CupStage } from '@models/v2/cup/cup-stage.model';
import { Season } from '@models/v2/season.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupStageSearch } from '@models/search/cup/cup-stage-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { CompetitionService } from '@services/v2/competition.service';
import { CupStageService } from '@services/v2/cup/cup-stage.service';
import { SeasonService } from '@services/v2/season.service';
import { SettingsService } from '@services/settings.service';
import { map } from 'rxjs/operators';

@Component({
   selector: 'app-cup-stage-select',
   templateUrl: './cup-stage-select.component.html'
})
export class CupStageSelectComponent implements OnInit {
   @Output() public cupStageSelected = new EventEmitter<{ cupStages: CupStage[]; selected: CupStage }>();

   public cupStageSelectForm: FormGroup;

   public competitionsBySeasonId: { [id: number]: Competition[] } = {};
   public cupStagesByCompetitionId: { [id: number]: CupStage[] } = {};
   public seasons: Season[] = [];

   constructor(
      private competitionService: CompetitionService,
      private cupStageService: CupStageService,
      private seasonService: SeasonService
   ) {}

   get competitionIdFormValue(): number {
      const value = this.cupStageSelectForm.get('competition_id').value;
      return value ? parseInt(value, 10) : null;
   }

   get cupStageIdFormValue(): number {
      const value = this.cupStageSelectForm.get('cup_stage_id').value;
      return value ? parseInt(value, 10) : null;
   }

   get seasonIdFormValue(): number {
      const value = this.cupStageSelectForm.get('season_id').value;
      return value ? parseInt(value, 10) : null;
   }

   public ngOnInit(): void {
      this.cupStageSelectForm = this.getCupStageSelectFormGroup();
      this.getSeasonsData();
      this.subscribeToFormValueChanges();
   }

   public submit(): void {
      const cupStages = this.cupStagesByCompetitionId[this.competitionIdFormValue];
      const selected = cupStages.find(cupStage => cupStage.id === this.cupStageIdFormValue);
      if (selected) {
         this.cupStageSelected.emit({ cupStages, selected });
      }
   }

   private getCompetitionsData(seasonId: number): void {
      const search: CompetitionSearch = {
         limit: SettingsService.maxLimitValues.seasons,
         page: 1,
         seasonId,
         tournamentId: Tournament.Cup
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitionsBySeasonId[seasonId] = response.data;
      });
   }

   private getCupStagesData(competitionId: number): void {
      const search: CupStageSearch = {
         competitionId,
         page: 1,
         limit: SettingsService.maxLimitValues.cupStages,
         orderBy: 'id',
         sequence: Sequence.Ascending
      };
      this.cupStageService.getCupStages(search).subscribe(response => {
         this.cupStagesByCompetitionId[competitionId] = response.data;
      });
   }

   private getCupStageSelectFormGroup(): FormGroup {
      return new FormGroup({
         season_id: new FormControl(null),
         competition_id: new FormControl(null),
         cup_stage_id: new FormControl(null)
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
      this.cupStageSelectForm.get('cup_stage_id').reset();
      if (competitionId && !this.cupStagesByCompetitionId[competitionId]) {
         this.getCupStagesData(competitionId);
      }
   }

   private formValueSeasonIdChanged(competitionId: number): void {
      this.cupStageSelectForm.get('competition_id').reset();
      if (competitionId && !this.competitionsBySeasonId[competitionId]) {
         this.getCompetitionsData(competitionId);
      }
   }

   private subscribeToFormValueChanges(): void {
      this.cupStageSelectForm
         .get('season_id')
         .valueChanges.pipe(map(value => parseInt(value, 10)))
         .subscribe(value => {
            this.formValueSeasonIdChanged(value);
         });

      this.cupStageSelectForm
         .get('competition_id')
         .valueChanges.pipe(map(value => parseInt(value, 10)))
         .subscribe(value => {
            this.formValueCompetitionIdChanged(value);
         });
   }
}
