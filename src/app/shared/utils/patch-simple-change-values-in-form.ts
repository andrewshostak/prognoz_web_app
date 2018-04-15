import { SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

export function patchSimpleChangeValuesInForm(
    simpleChanges: SimpleChanges,
    formGroup: FormGroup,
    key: string,
    onUpdatedCallback?: (
        formGroup: FormGroup,
        field: string,
        value: any
    ) => void
): void {
    Object.entries(simpleChanges)
        .filter(([propName, change]) => propName === key && !change.firstChange)
        .forEach(([propName, valueChange]) => {
            if (valueChange.currentValue) {
                Object.entries(valueChange.currentValue).forEach(
                    ([field, value]) => {
                        if (formGroup.get(field)) {
                            if (onUpdatedCallback) {
                                onUpdatedCallback(formGroup, field, value);
                            } else {
                                formGroup.patchValue({ [field]: value });
                            }
                        }
                    }
                );
            } else {
                formGroup.reset();
            }
        });
}
