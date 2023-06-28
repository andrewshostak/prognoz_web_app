import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-confirmation-modal',
   templateUrl: './confirmation-modal.component.html',
   styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
   @Input() close: () => void;
   @Input() message;
   @Output() confirmed = new EventEmitter<void>();

   defaultMessage: string;

   ngOnInit() {
      this.defaultMessage = 'Ви впевнені що хочете продовжити?';
   }

   onModalConfirm(): void {
      this.confirmed.emit();
   }
}
