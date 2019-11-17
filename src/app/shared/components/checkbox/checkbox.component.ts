import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
   selector: 'app-checkbox',
   templateUrl: './checkbox.component.html',
   styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
   @Input() public formGroup: FormGroup;
   @Input() public fControlName: string;
   @Input() public label: string;
}
