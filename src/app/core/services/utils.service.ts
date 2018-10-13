import { Injectable, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable()
export class UtilsService {
    static clearFormArray(formArray: FormArray): void {
        while (0 !== formArray.length) {
            formArray.removeAt(0);
        }
    }

    static getDistinctItemsOfArray<T>(items: T[], key: string = 'id'): T[] {
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

    static getHomeCityInBrackets(hometown: string): string {
        return hometown ? '(' + hometown + ')' : '';
    }

    static getItemFromLocalStorage(key: string): any {
        return JSON.parse(localStorage.getItem(key));
    }

    static showScoresOrString(home, away, noScore: string): string {
        if (home != null && away != null) {
            return home + ' : ' + away;
        }

        return noScore;
    }

    static groupBy(list: any[], keyGetter) {
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

    static isScore(home: number, away: number): boolean {
        return home != null && away != null;
    }

    static makeUnsigned(moving: number) {
        return Math.abs(moving);
    }

    static patchSimpleChangeValuesInForm(
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

    static createRoundsArrayFromTeamsQuantity(numberOfTeams: number): { id: number; title: string }[] {
        const numberOfRounds = numberOfTeams * 2 - 2;
        return this.createRoundsArray(numberOfRounds);
    }

    static createRoundsArray(numberOfRounds: number): { id: number; title: string }[] {
        return Array.from({ length: numberOfRounds }).map((item, index) => {
            const round = ++index;
            return { id: round, title: `Тур ${round}` };
        });
    }
}
