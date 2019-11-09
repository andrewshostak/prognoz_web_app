import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class FormValidatorService {
   public static fileSizeLimits: { [key: string]: number } = {
      teamImage: 524288
   };

   public static fileExtensions: { [key: string]: string[] } = {
      teamImage: ['png', 'jpeg', 'jpg']
   };

   public fileSize(maxSize: number): ValidatorFn {
      return (formControl: FormControl) => {
         const file: File = formControl.value;
         if (file) {
            return file.size > maxSize ? { invalidFileSize: true } : null;
         }

         return null;
      };
   }

   public fileType(types: string[]): ValidatorFn {
      return (formControl: FormControl) => {
         const file = formControl.value;
         if (file) {
            const extension = file.name.split('.')[1].toLowerCase();
            if (!types.includes(extension)) {
               return { invalidFileType: true };
            }

            return null;
         }

         return null;
      };
   }

   public parity(): ValidatorFn {
      return (abstractControl: AbstractControl): { [key: string]: boolean } => {
         if (abstractControl.value) {
            return abstractControl.value % 2 === 0 ? null : { invalidParity: true };
         }
         return null;
      };
   }
}
