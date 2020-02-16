import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Sequence } from '@enums/sequence.enum';
import { TeamNew } from '@models/new/team-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { TeamSearch } from '@models/search/team-search.model';
import { TeamNewService } from '@services/new/team-new.service';
import { SettingsService } from '@services/settings.service';
import { trim } from 'lodash';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-team-select',
   templateUrl: './team-select.component.html',
   styleUrls: ['./team-select.component.scss']
})
export class TeamSelectComponent implements OnChanges, OnInit {
   @Input() public teamsList: TeamNew[] = [];
   @Input() public formGroup: FormGroup;

   public ngSelectTexts: { [key: string]: string };
   public teams$: Observable<TeamNew[]>;
   public teamsLoading: boolean;
   public teamsInput$: Subject<string>;
   public teamsList$: Subject<TeamNew[]>;
   public teamsTypeAhead: EventEmitter<string>;

   constructor(private teamService: TeamNewService) {}

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes.teamsList && !changes.teamsList.isFirstChange() && changes.teamsList.currentValue) {
         this.teamsList$.next(changes.teamsList.currentValue);
      }
   }

   public ngOnInit(): void {
      this.ngSelectTexts = SettingsService.textMessages.ngSelect;
      this.teamsInput$ = new Subject<string>();
      this.teamsList$ = new Subject<TeamNew[]>();
      this.teamsLoading = false;
      this.teamsTypeAhead = new EventEmitter<string>();
      this.enableTypeAheadSearch();
   }

   private enableTypeAheadSearch(): void {
      this.teams$ = merge(
         of(this.teamsList), // default users
         this.teamsList$,
         this.teamsInput$.pipe(
            distinctUntilChanged(),
            debounceTime(SettingsService.defaultDebounceTime),
            filter(term => term && term.length >= 1),
            tap(() => (this.teamsLoading = true)),
            switchMap((term: string) => {
               const search: TeamSearch = {
                  limit: SettingsService.maxLimitValues.users,
                  name: trim(term),
                  orderBy: 'name',
                  page: 1,
                  sequence: Sequence.Ascending
               };

               return this.teamService.getTeams(search).pipe(
                  catchError(() => of([])),
                  tap(() => (this.teamsLoading = false)),
                  map((response: PaginatedResponse<TeamNew>) => response.data)
               );
            })
         )
      );
   }
}