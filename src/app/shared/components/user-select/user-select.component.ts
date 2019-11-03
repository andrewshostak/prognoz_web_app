import { Component, EventEmitter, forwardRef, Input, OnInit } from '@angular/core';
import {
   AbstractControl,
   ControlValueAccessor,
   FormControl,
   FormGroup,
   NG_VALIDATORS,
   NG_VALUE_ACCESSOR,
   ValidationErrors,
   Validator,
   Validators
} from '@angular/forms';

import { Sequence } from '@enums/sequence.enum';
import { UserNew } from '@models/new/user-new.model';
import { PaginatedResponse } from '@models/paginated-response.model';
import { UserSearch } from '@models/search/user-search.model';
import { UserNewService } from '@services/new/user-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { trim } from 'lodash';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

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
export class UserSelectComponent implements OnInit, ControlValueAccessor, Validator {
   @Input() public label: string;

   public userSelectFormGroup: FormGroup = new FormGroup({
      user_id: new FormControl(null, [Validators.required])
   });
   public usersTypeAhead: EventEmitter<string>;
   public users: UserNew[];

   constructor(private userService: UserNewService) {}

   public ngOnInit() {
      this.users = [];
      this.usersTypeAhead = new EventEmitter<string>();
      this.enableTypeAheadSearch();
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   // TODO: inspect all this functions

   // tslint:disable-next-line:no-empty
   public onTouched: () => void = () => {};

   public writeValue(val: any): void {
      if (val) {
         this.userSelectFormGroup.setValue(val, { emitEvent: false });
      }
   }

   public registerOnChange(fn: any): void {
      this.userSelectFormGroup.valueChanges.subscribe(fn);
   }

   public registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   public setDisabledState?(isDisabled: boolean): void {
      isDisabled ? this.userSelectFormGroup.disable() : this.userSelectFormGroup.enable();
   }

   public validate(c: AbstractControl): ValidationErrors | null {
      return this.userSelectFormGroup.valid ? null : { invalidForm: { valid: false, message: 'user select form control is invalid' } };
   }

   private enableTypeAheadSearch(): void {
      this.usersTypeAhead
         .pipe(
            distinctUntilChanged(),
            debounceTime(SettingsService.defaultDebounceTime),
            switchMap(term => {
               const value = trim(term);
               if (!value) {
                  return of({ data: [] } as PaginatedResponse<UserNew>);
               }

               const search: UserSearch = {
                  limit: SettingsService.usersPerPage,
                  name: value,
                  orderBy: 'name',
                  sequence: Sequence.Ascending
               };

               return this.userService.getUsers(search);
            })
         )
         .subscribe(response => {
            this.users = (response as PaginatedResponse<UserNew>).data;
         });
   }
}
