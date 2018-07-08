import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class FormValidatorService {
    constructor() {}

    parity(): ValidatorFn {
        return (abstractControl: AbstractControl): { [key: string]: boolean } => {
            if (abstractControl.value) {
                return abstractControl.value % 2 === 0 ? null : { invalidParity: true };
            }
            return null;
        };
    }
}
