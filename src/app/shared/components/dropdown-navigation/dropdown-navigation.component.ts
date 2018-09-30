import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dropdown-navigation',
    templateUrl: './dropdown-navigation.component.html',
    styleUrls: ['./dropdown-navigation.component.scss']
})
export class DropdownNavigationComponent implements OnInit {
    constructor(private router: Router) {}

    @Input() dropdownItems: any[];
    @Input() selectedId: number;
    @Input() navigationPath: any[];
    @Input() formSize: 'sm' | 'lg';

    form: FormGroup;

    inputValuesPresent(): boolean {
        return this.dropdownItems && this.dropdownItems.length && !!this.selectedId;
    }

    isFirst(): boolean {
        if (!this.inputValuesPresent()) {
            return false;
        }

        return this.dropdownItems.findIndex(dropdownItem => dropdownItem.id === this.selectedId) === 0;
    }

    isLast(): boolean {
        if (!this.inputValuesPresent()) {
            return false;
        }

        return this.dropdownItems.findIndex(dropdownItem => dropdownItem.id === this.selectedId) === this.dropdownItems.length - 1;
    }

    ngOnInit() {
        this.form = new FormGroup({
            id: new FormControl(this.selectedId)
        });

        this.form.get('id').valueChanges.subscribe(value => {
            this.selectedId = parseInt(value, 10);
            this.navigateTo(this.selectedId);
        });
    }

    navigateTo(id: number): void {
        if (this.navigationPath.includes('cup-matches')) {
            this.navigateToCupMatchesByStage(this.navigationPath, id);
            return;
        }

        this.router.navigate([`${this.navigationPath}/${id}`]);
    }

    navigateToCupMatchesByStage(path: any[], id: number): void {
        const index = path.findIndex(part => {
            return part.cup_stage_id && part.cup_stage_id === ':id';
        });

        if (index < 0) {
            return;
        }

        path[index] = { cup_stage_id: id };
        this.router.navigate(path);
    }

    next(): void {
        if (this.isLast()) {
            return;
        }

        const index = this.dropdownItems.findIndex(dropdownItem => dropdownItem.id === this.selectedId);
        const nextItemIndex = index + 1;

        if (!this.dropdownItems[nextItemIndex]) {
            return;
        }

        this.form.get('id').setValue(this.dropdownItems[nextItemIndex].id);
    }

    previous(): void {
        if (this.isFirst()) {
            return;
        }

        const index = this.dropdownItems.findIndex(dropdownItem => dropdownItem.id === this.selectedId);
        const previousItemIndex = index - 1;

        if (!this.dropdownItems[previousItemIndex]) {
            return;
        }

        this.form.get('id').setValue(this.dropdownItems[previousItemIndex].id);
    }
}
