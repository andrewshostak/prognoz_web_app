import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class FormValidatorService {
   public static fileSizeLimits: { [key: string]: number } = {
      clubImage: 204800,
      newsImage: 524288,
      teamImage: 524288,
      userImage: 524288
   };

   public static fileExtensions: { [key: string]: string[] } = {
      clubImage: ['png'],
      newsImage: ['png', 'jpeg', 'jpg'],
      teamImage: ['png', 'jpeg', 'jpg'],
      userImage: ['png', 'jpeg', 'jpg']
   };

   public fileSize(maxSize: number): ValidatorFn {
      return (formControl: FormControl) => {
         const file: File = formControl.value;
         if (file && file instanceof File) {
            return file.size > maxSize ? { invalidFileSize: true } : null;
         }

         return null;
      };
   }

   public fileType(types: string[]): ValidatorFn {
      return (formControl: FormControl) => {
         const file = formControl.value;
         if (file && file instanceof File) {
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

   public json(): ValidatorFn {
      return (formControl: FormControl) => {
         if (!this.isJson(formControl.value)) {
            return { invalidJson: true };
         }
         return null;
      };
   }

   private isJson(value: string): boolean {
      let isJson = false;
      try {
         JSON.parse(value);
         isJson = true;
         // tslint:disable:no-empty
      } catch (e) {}

      return isJson;
   }
}
