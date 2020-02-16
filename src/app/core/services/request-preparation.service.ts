import { Injectable } from '@angular/core';

import { isBoolean } from 'lodash';

@Injectable()
export class RequestPreparationService {
   public static toFormData<T>(formValue: T, modifyBooleans: boolean = true): FormData {
      const formData = new FormData();

      Object.keys(formValue).forEach(key => {
         let value: string | Blob = formValue[key];
         if (value === null) {
            return;
         }

         if (modifyBooleans && isBoolean(value)) {
            value = value ? '1' : '0';
         }

         formData.append(key, value);
      });

      return formData;
   }
}
