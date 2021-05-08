import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
   selector: 'app-dropdown-navigation',
   templateUrl: './dropdown-navigation.component.html',
   styleUrls: ['./dropdown-navigation.component.scss']
})
export class DropdownNavigationComponent implements OnChanges, OnInit {
   @Input() public dropdownItems: any[];
   @Input() public selectedId: number;
   @Input() public navigationPath: any[];
   @Input() public formSize: 'sm' | 'lg';

   public form: FormGroup;
   constructor(private router: Router) {}

   public inputValuesPresent(): boolean {
      return this.dropdownItems && this.dropdownItems.length && !!this.selectedId;
   }

   public isFirst(): boolean {
      if (!this.inputValuesPresent()) {
         return false;
      }

      return this.dropdownItems.findIndex(dropdownItem => dropdownItem.id === this.selectedId) === 0;
   }

   public isLast(): boolean {
      if (!this.inputValuesPresent()) {
         return false;
      }

      return this.dropdownItems.findIndex(dropdownItem => dropdownItem.id === this.selectedId) === this.dropdownItems.length - 1;
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (
         changes.selectedId &&
         this.form &&
         (this.navigationPath.includes('cup-matches') || this.navigationPath.includes('team-matches'))
      ) {
         if (changes.selectedId.currentValue) {
            this.form.get('id').setValue(changes.selectedId.currentValue);
         }
      }
   }

   public ngOnInit() {
      this.form = new FormGroup({
         id: new FormControl(this.selectedId)
      });

      this.form.get('id').valueChanges.subscribe(value => {
         this.selectedId = parseInt(value, 10);
         this.navigateTo(this.selectedId);
      });
   }

   public navigateTo(id: number): void {
      if (this.navigationPath.includes('cup-matches')) {
         this.navigateWithParam(this.navigationPath, { cup_stage_id: id });
         return;
      } else if (this.navigationPath.includes('team-matches')) {
         this.navigateWithParam(this.navigationPath, { team_stage_id: id });
         return;
      }

      this.router.navigate(this.navigationPath.concat(id));
   }

   public navigateWithParam(path: any[], param: { [key: string]: number }): void {
      path[path.length - 1] = param;
      this.router.navigate(path);
   }

   public next(): void {
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

   public previous(): void {
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
