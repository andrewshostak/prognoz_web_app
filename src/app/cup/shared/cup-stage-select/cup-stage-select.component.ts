import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionNew } from '@models/new/competition-new.model';
import { CupStageNew } from '@models/new/cup-stage-new';
import { SeasonNew } from '@models/new/season-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CupStageSearch } from '@models/search/cup-stage-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { CupStageNewService } from '@services/new/cup-stage-new.service';
import { SeasonNewService } from '@services/new/season-new.service';
import { SettingsService } from '@services/settings.service';
import { map } from 'rxjs/operators';

@Component({
   selector: 'app-cup-stage-select',
   templateUrl: './cup-stage-select.component.html'
})
export class CupStageSelectComponent implements OnInit {
   @Output() public cupStageSelected = new EventEmitter<{ cupStages: CupStageNew[]; selected: CupStageNew }>();

   public cupStageSelectForm: FormGroup;

   public competitionsBySeasonId: { [id: number]: CompetitionNew[] } = {};
   public cupStagesByCompetitionId: { [id: number]: CupStageNew[] } = {};
   public seasons: SeasonNew[] = [];

   constructor(
      private competitionService: CompetitionNewService,
      private cupStageService: CupStageNewService,
      private seasonService: SeasonNewService
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
