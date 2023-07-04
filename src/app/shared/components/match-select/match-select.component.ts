import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { MatchState } from '@enums/match-state.enum';
import { Sequence } from '@enums/sequence.enum';
import { Match } from '@models/v2/match.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { MatchSearch } from '@models/search/match-search.model';
import { MatchService } from '@services/api/v2/match.service';
import { SettingsService } from '@services/settings.service';
import { PaginationService } from '@services/pagination.service';
import { UtilsService } from '@services/utils.service';
import { differenceWith, get, remove } from 'lodash';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
   selector: 'app-match-select',
   styleUrls: ['./match-select.component.scss'],
   templateUrl: './match-select.component.html'
})
export class MatchSelectComponent implements OnChanges, OnInit {
   @Input() public fGroup: FormGroup;
   @Input() public match: Match;
   @Input() public tournamentMatchesObservable: Observable<PaginatedResponse<any>>;
   @Input() public createdMatchId: number;

   public clubsLogosPath: string;
   public matches: Match[];

   constructor(private matchService: MatchService) {}

   get matchSearch(): MatchSearch {
      return {
         states: [MatchState.Active],
         limit: PaginationService.limit.matches,
         orderBy: 'started_at',
         page: 1,
         sequence: Sequence.Descending
      };
   }

   public getMatchesData(): void {
      this.matchService.getMatches(this.matchSearch).subscribe(response => {
         this.setMatches(response.data);
      });
   }

   public getMatchesAndTournamentMatchesData(): void {
      const requests = [this.matchService.getMatches(this.matchSearch), this.tournamentMatchesObservable];
      forkJoin(requests)
         .pipe(
            map(([matches, tournamentMatches]) => {
               return { matches, tournamentMatches };
            })
         )
         .subscribe(response => {
            const matches = differenceWith(response.matches.data, response.tournamentMatches.data, (arrVal, othVal) => {
               return arrVal.id === othVal.match_id;
            });
            this.setMatches(matches);
         });
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (get(changes, 'match.currentValue') && !changes.match.firstChange) {
         this.matches = this.matches ? [changes.match.currentValue].concat(this.matches) : [changes.match.currentValue];
      }
      if (get(changes, 'createdMatchId.currentValue')) {
         remove(this.matches, match => match.id === changes.createdMatchId.currentValue);
         this.matches = [...this.matches];
      }
   }

   public ngOnInit(): void {
      this.clubsLogosPath = SettingsService.imageBaseUrl.clubs;
      this.tournamentMatchesObservable ? this.getMatchesAndTournamentMatchesData() : this.getMatchesData();
   }

   public matchesFilter(term: string, match: Match): boolean {
      const title = term.toLocaleLowerCase();
      return match.club_home.title.toLocaleLowerCase().indexOf(title) > -1 || match.club_away.title.toLocaleLowerCase().indexOf(title) > -1;
   }

   public setMatches(responseMatches: Match[]): void {
      this.matches = this.match ? responseMatches.concat([this.match]) : responseMatches;
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }
}
