import { Injectable, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

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

   public static getHomeCityInBrackets(hometown: string): string {
      return hometown ? '(' + hometown + ')' : '';
   }

   public static getItemFromLocalStorage(key: string): any {
      return JSON.parse(localStorage.getItem(key));
   }

   public static showScoresOrString(home, away, noScore: string): string {
      if (home != null && away != null) {
         return home + ' : ' + away;
      }

      return noScore;
   }

   public static groupBy(list: any[], keyGetter) {
      const map = new Map();
      list.forEach(item => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
            map.set(key, [item]);
         } else {
            collection.push(item);
         }
      });
      return map;
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
}
