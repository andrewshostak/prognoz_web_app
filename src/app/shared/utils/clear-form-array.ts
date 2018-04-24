import { FormArray } from '@angular/forms';

export function clearFormArray(formArray: FormArray): void {
    while (0 !== formArray.length) {
        formArray.removeAt(0);
    }
}
