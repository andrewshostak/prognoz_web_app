import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { Competition } from '@models/v2/competition.model';
import { Season } from '@models/v2/season.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { SeasonSearch } from '@models/search/season-search.model';
import { CurrentStateService } from '@services/current-state.service';
import { CompetitionService } from '@services/api/v2/competition.service';
import { SeasonService } from '@services/api/v2/season.service';
import { PaginationService } from '@services/pagination.service';
import { UtilsService } from '@services/utils.service';
import { iif, Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-competition-select',
   templateUrl: './competition-select.component.html',
   styleUrls: ['./competition-select.component.scss']
})
export class CompetitionSelectComponent implements OnInit {
   // made for team competition. modify this component to use with cup/championship by adding @Input()
   @Output() public competitionSelected = new EventEmitter<{ selected: Competition | Partial<Competition> }>();

   public competitions: Competition[] = [];
   public selectedCompetitionId: number = null;

   public seasons: Season[] = [];
   public showCompetitionSelect: boolean = false;
   public competitionsBySeasonId: { [id: number]: Competition[] } = {};
   public competitionSelectForm: FormGroup;

   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionService,
      private currentStateService: CurrentStateService,
      private seasonService: SeasonService
   ) {}

   get competitionIdFormValue(): number {
      const value = this.competitionSelectForm.get('competition_id').value;
      return value ? parseInt(value, 10) : null;
   }

   get seasonIdFormValue(): number {
      const value = this.competitionSelectForm.get('season_id').value;
      return value ? parseInt(value, 10) : null;
   }

   public clickOnCompetitionButton(competition: Competition): void {
      if (this.selectedCompetitionId === competition.id) {
         return;
      }

      this.currentStateService.teamCompetitionId = competition.id;
      this.selectedCompetitionId = competition.id;
      this.competitionSelected.emit({ selected: competition });
   }

   public ngOnInit(): void {
      this.competitionSelectForm = this.getCompetitionSelectFormGroup();
      this.subscribeToFormValueChanges();
      this.initializeComponentData();
   }

   public submit(): void {
      const competitions = this.competitionsBySeasonId[this.seasonIdFormValue];
      const selected = competitions.find(competition => competition.id === this.competitionIdFormValue);
      if (selected) {
         this.competitionSelected.emit({ selected });
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

   private getCompetitionSelectFormGroup(): FormGroup {
      return new FormGroup({
         season_id: new FormControl(null),
         competition_id: new FormControl(null)
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

   private getSeasonsObservable(): Observable<PaginatedResponse<Season>> {
      const search: SeasonSearch = {
         limit: PaginationService.limit.seasons,
         orderBy: 'id',
         page: 1,
         sequence: Sequence.Descending
      };
      return this.seasonService.getSeasons(search);
   }

   private initializeComponentData(): void {
      this.getCompetitionsObservable()
         .pipe(
            tap(response => (this.competitions = response.data)),
            tap(response => {
               if (this.activatedRoute.snapshot.params.competition_id) {
                  this.selectedCompetitionId = parseInt(this.activatedRoute.snapshot.params.competition_id, 10);
                  return;
               }

               const id = UtilsService.getCompetitionID(response.data, this.currentStateService.teamCompetitionId);
               this.selectedCompetitionId = id;
               this.competitionSelected.emit({ selected: { id } });
            })
         )
         .subscribe();

      this.getSeasonsObservable()
         .pipe(tap(response => (this.seasons = response.data)))
         .subscribe();
   }

   private formValueSeasonIdChanged(competitionId: number): void {
      this.competitionSelectForm.get('competition_id').reset();
      if (competitionId && !this.competitionsBySeasonId[competitionId]) {
         this.getCompetitionsData(competitionId);
      }
   }

   private subscribeToFormValueChanges(): void {
      this.competitionSelectForm
         .get('season_id')
         .valueChanges.pipe(map(value => parseInt(value, 10)))
         .subscribe(value => {
            this.formValueSeasonIdChanged(value);
         });
   }
}
