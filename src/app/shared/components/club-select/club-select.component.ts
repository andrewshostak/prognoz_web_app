import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
   AbstractControl,
   ControlValueAccessor,
   FormControl,
   FormGroup,
   NG_VALIDATORS,
   NG_VALUE_ACCESSOR,
   ValidationErrors,
   Validator
} from '@angular/forms';
import { ClubNew } from '@models/v2/club-new.model';
import { merge, Observable, of, Subject } from 'rxjs';
import { ClubNewService } from '@services/new/club-new.service';
import { SettingsService } from '@services/settings.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { trim } from 'lodash';
import { Sequence } from '@enums/sequence.enum';
import { PaginatedResponse } from '@models/paginated-response.model';
import { ClubSearch } from '@models/search/club-search.model';

@Component({
   selector: 'app-club-select',
   templateUrl: './club-select.component.html',
   styleUrls: ['./club-select.component.scss'],
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: forwardRef(() => ClubSelectComponent),
         multi: true
      },
      {
         provide: NG_VALIDATORS,
         useExisting: forwardRef(() => ClubSelectComponent),
         multi: true
      }
   ]
})
export class ClubSelectComponent implements OnChanges, OnInit, ControlValueAccessor, Validator {
   @Input() public clubsList: ClubNew[] = [];
   @Input() public type: 'national_teams' | 'clubs' = null;

   public ngSelectTexts: { [key: string]: string };
   public onChange: (value: any) => void;
   public onTouched: () => void;
   public clubs$: Observable<ClubNew[]>;
   public clubsList$: Subject<ClubNew[]>;
   public clubsLoading: boolean;
   public clubsInput$: Subject<string>;
   public clubSelectFormGroup: FormGroup;
   public clubsTypeAhead: EventEmitter<string>;
   public clubsLogosPath = SettingsService.clubsLogosPath + '/';

   constructor(private clubsService: ClubNewService) {}

   public focusOut(): void {
      this.onTouched();
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes.clubsList && !changes.clubsList.isFirstChange() && changes.clubsList.currentValue) {
         this.clubsList$.next(changes.clubsList.currentValue);
      }
   }

   public ngOnInit(): void {
      this.ngSelectTexts = SettingsService.textMessages.ngSelect;
      this.clubSelectFormGroup = new FormGroup({ club_id: new FormControl(null) });
      this.clubsInput$ = new Subject<string>();
      this.clubsList$ = new Subject<ClubNew[]>();
      this.clubsLoading = false;
      this.clubsTypeAhead = new EventEmitter<string>();
      this.enableTypeAheadSearch();
   }

   public registerOnChange(fn: any): void {
      this.onChange = fn;
      this.clubSelectFormGroup.get('club_id').valueChanges.subscribe(value => {
         this.onChange(value);
      });
   }

   public registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   public setDisabledState?(isDisabled: boolean): void {
      isDisabled ? this.clubSelectFormGroup.disable() : this.clubSelectFormGroup.enable();
   }

   public validate(c: AbstractControl): ValidationErrors | null {
      return this.clubSelectFormGroup.valid ? null : { invalidClubForm: true };
   }

   public writeValue(value: any): void {
      if (value) {
         this.clubSelectFormGroup.get('club_id').setValue(value);
      }
   }

   private enableTypeAheadSearch(): void {
      this.clubs$ = merge(
         of(this.clubsList), // default clubs
         this.clubsList$,
         this.clubsInput$.pipe(
            distinctUntilChanged(),
            debounceTime(SettingsService.defaultDebounceTime),
            switchMap((term: string) => {
               if (!term) {
                  return of(this.clubsList);
               }

               this.clubsLoading = true;

               const search: ClubSearch = {
                  page: 1,
                  limit: SettingsService.maxLimitValues.clubs,
                  search: trim(term),
                  orderBy: 'title',
                  sequence: Sequence.Ascending,
                  type: this.type || null
               };

               return this.clubsService.getClubs(search).pipe(
                  catchError(() => of([])),
                  tap(() => (this.clubsLoading = false)),
                  map((response: PaginatedResponse<ClubNew>) => response.data)
               );
            })
         )
      );
   }
}
