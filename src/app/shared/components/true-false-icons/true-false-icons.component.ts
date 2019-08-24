import { Component, Input } from '@angular/core';

@Component({
   selector: 'app-true-false-icons',
   styleUrls: ['./true-false-icons.component.scss'],
   templateUrl: './true-false-icons.component.html'
})
export class TrueFalseIconsComponent {
   @Input() public value: boolean;
}
