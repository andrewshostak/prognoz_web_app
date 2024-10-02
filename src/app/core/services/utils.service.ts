import { Injectable, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

import { Competition } from '@models/v2/competition.model';

@Injectable()
export class UtilsService {
   public static showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return abstractControl.touched && abstractControl.hasError(errorKey);
   }

   public static showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return abstractControl.invalid && abstractControl.touched;
   }

   public static clearFormArray(formArray: FormArray): void {
      while (0 !== formArray.length) {
         formArray.removeAt(0);
      }
   }

   public static getCompetitionID(competitions: Competition[], selectedCompetitionId: number | null): number | null {
      if (!competitions.length && !selectedCompetitionId) {
         return null;
      }

      if (!selectedCompetitionId) {
         return competitions[0].id;
      }

      const ids = competitions.map(competition => competition.id);
      return ids.includes(selectedCompetitionId) ? selectedCompetitionId : competitions[0].id;
   }

   public static getHomeCityInBrackets(hometown: string): string {
      return hometown ? '(' + hometown + ')' : '';
   }

   public static showScoresOrString(home, away, noScore: string): string {
      if (home != null && away != null) {
         return home + ' : ' + away;
      }

      return noScore;
   }

   public static isScore(home: number, away: number): boolean {
      return home != null && away != null;
   }

   public static makeUnsigned(moving: number) {
      return Math.abs(moving);
   }

   public static patchSimpleChangeValuesInForm(
      simpleChanges: SimpleChanges,
      formGroup: FormGroup,
      key: string,
      onUpdatedCallback?: (formGroup: FormGroup, field: string, value: any) => void
   ): void {
      Object.entries(simpleChanges)
         .filter(([propName, change]) => propName === key && !change.firstChange)
         .forEach(([propName, valueChange]) => {
            if (valueChange.currentValue) {
               this.patchObjectValuesInForm(valueChange.currentValue, formGroup, onUpdatedCallback);
            } else {
               formGroup.reset();
            }
         });
   }

   public static patchObjectValuesInForm<T>(
      model: T,
      formGroup: FormGroup,
      onUpdatedCallback?: (formGroup: FormGroup, field: string, value: any) => void
   ): void {
      Object.entries(model).forEach(([field, value]) => {
         if (onUpdatedCallback) {
            onUpdatedCallback(formGroup, field, value);
         } else {
            return formGroup.get(field) && formGroup.patchValue({ [field]: value });
         }
      });
   }
   // return selected competition id if it is present in competitions list, otherwise return first id from the list
}
