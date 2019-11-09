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

   public static getDistinctItemsOfArray<T>(items: T[], key: string = 'id'): T[] {
      const distinctItems = [];
      if (!items.length) {
         return distinctItems;
      }
      items.forEach(item => {
         if (!distinctItems.find(distinctItem => distinctItem[key] === item[key])) {
            distinctItems.push(item);
         }
      });
      return distinctItems;
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
               Object.entries(valueChange.currentValue).forEach(([field, value]) => {
                  if (onUpdatedCallback) {
                     onUpdatedCallback(formGroup, field, value);
                  } else {
                     if (formGroup.get(field)) {
                        formGroup.patchValue({ [field]: value });
                     }
                  }
               });
            } else {
               formGroup.reset();
            }
         });
   }

   public static createRoundsArrayFromTeamsQuantity(numberOfTeams: number): Array<{ id: number; title: string }> {
      const numberOfRounds = numberOfTeams * 2 - 2;
      return this.createRoundsArray(numberOfRounds);
   }

   public static createRoundsArray(numberOfRounds: number): Array<{ id: number; title: string }> {
      return Array.from({ length: numberOfRounds }).map((item, index) => {
         const round = ++index;
         return { id: round, title: `Тур ${round}` };
      });
   }

   public static toFormData<T>(formValue: T): FormData {
      const formData = new FormData();

      for (const key of Object.keys(formValue)) {
         const value = formValue[key];
         formData.append(key, value);
      }

      return formData;
   }
}
