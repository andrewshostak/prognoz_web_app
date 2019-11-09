import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class FormValidatorService {
   public parity(): ValidatorFn {
      return (abstractControl: AbstractControl): { [key: string]: boolean } => {
         if (abstractControl.value) {
            return abstractControl.value % 2 === 0 ? null : { invalidParity: true };
         }
         return null;
      };
   }

   public requiredFileType(types: string[]): ValidatorFn {
      return (formControl: FormControl) => {
         const file = formControl.value;
         if (file) {
            const extension = file.name.split('.')[1].toLowerCase();
            if (!types.includes(extension)) {
               return { requiredFileType: true };
            }

            return null;
         }

         return null;
      };
   }
}
