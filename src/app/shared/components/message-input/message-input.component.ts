import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-message-input',
   templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
   @Input() public fGroup: FormGroup;
   @Input() public showLabel: boolean = false;

   public showFormErrorMessage = UtilsService.showFormErrorMessage;
   public showFormInvalidClass = UtilsService.showFormInvalidClass;
}
