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

import { Sequence } from '@enums/sequence.enum';
import { User } from '@models/v2/user.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { UserSearch } from '@models/search/user-search.model';
import { UserService } from '@services/v2/user.service';
import { SettingsService } from '@services/settings.service';
import { trim } from 'lodash';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

@Component({
   selector: 'app-user-select',
   templateUrl: './user-select.component.html',
   styleUrls: ['./user-select.component.scss'],
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: forwardRef(() => UserSelectComponent),
         multi: true
      },
      {
         provide: NG_VALIDATORS,
         useExisting: forwardRef(() => UserSelectComponent),
         multi: true
      }
   ]
})
export class UserSelectComponent implements OnChanges, OnInit, ControlValueAccessor, Validator {
   @Input() public usersList: User[] = [];

   public ngSelectTexts: { [key: string]: string };
   public onChange: (value: any) => void;
   public onTouched: () => void;
   public users$: Observable<User[]>;
   public usersList$: Subject<User[]>;
   public usersLoading: boolean;
   public usersInput$: Subject<string>;
   public userSelectFormGroup: FormGroup;
   public usersTypeAhead: EventEmitter<string>;

   constructor(private userService: UserService) {}

   public focusOut(): void {
      this.onTouched();
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes.usersList && !changes.usersList.isFirstChange() && changes.usersList.currentValue) {
         this.usersList$.next(changes.usersList.currentValue);
      }
   }

   public ngOnInit() {
      this.ngSelectTexts = SettingsService.textMessages.ngSelect;
      this.userSelectFormGroup = new FormGroup({ user_id: new FormControl(null) });
      this.usersInput$ = new Subject<string>();
      this.usersList$ = new Subject<User[]>();
      this.usersLoading = false;
      this.usersTypeAhead = new EventEmitter<string>();
      this.enableTypeAheadSearch();
   }

   public registerOnChange(fn: any): void {
      this.onChange = fn;
      this.userSelectFormGroup.get('user_id').valueChanges.subscribe(value => {
         this.onChange(value);
      });
   }

   public registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   public setDisabledState?(isDisabled: boolean): void {
      isDisabled ? this.userSelectFormGroup.disable() : this.userSelectFormGroup.enable();
   }

   public validate(c: AbstractControl): ValidationErrors | null {
      return this.userSelectFormGroup.valid ? null : { invalidUserForm: true };
   }

   public writeValue(value: any): void {
      if (value) {
         this.userSelectFormGroup.get('user_id').setValue(value);
      }
   }

   private enableTypeAheadSearch(): void {
      this.users$ = merge(
         of(this.usersList), // default users
         this.usersList$,
         this.usersInput$.pipe(
            distinctUntilChanged(),
            debounceTime(SettingsService.defaultDebounceTime),
            switchMap((term: string) => {
               if (!term) {
                  return of(this.usersList);
               }

               this.usersLoading = true;

               const search: UserSearch = {
                  limit: SettingsService.maxLimitValues.users,
                  name: trim(term),
                  orderBy: 'name',
                  sequence: Sequence.Ascending
               };

               return this.userService.getUsers(search).pipe(
                  catchError(() => of([])),
                  tap(() => (this.usersLoading = false)),
                  map((response: PaginatedResponse<User>) => response.data)
               );
            })
         )
      );
   }
}
