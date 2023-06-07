import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Comment } from '@models/v2/comment.model';
import { GuestbookMessage } from '@models/v2/guestbook-message.model';
import { User } from '@models/v2/user.model';

@Component({
   selector: 'app-user-message',
   templateUrl: './user-message.component.html',
   styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent {
   @Input() message: GuestbookMessage | Comment;
   @Input() authenticatedUser: User;
   @Input() permissionForDeleting: string;
   @Output() onDeleteButtonClick = new EventEmitter<number>();
   @Output() onUpdateButtonClick = new EventEmitter<GuestbookMessage | Comment>();

   public messageEditForm: FormGroup = new FormGroup({
      body: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(1000)])
   });
   public mode: 'view' | 'edit' = 'view';

   constructor(private domSanitizer: DomSanitizer) {}

   public assembleHTMLItem(message: string): SafeHtml {
      return this.domSanitizer.bypassSecurityTrustHtml(message);
   }

   public deleteButtonClick(id: number): void {
      this.onDeleteButtonClick.emit(id);
   }

   public editButtonClick(): void {
      const messageToEdit = this.message.body.replace(/<\s*\/?br\s*[\/]?>/gi, '');
      this.messageEditForm.get('body').setValue(messageToEdit);
      this.mode = 'edit';
   }

   public updateButtonClick(): void {
      if (this.messageEditForm.invalid) {
         return;
      }
      this.onUpdateButtonClick.emit({ ...this.message, body: this.messageEditForm.get('body').value });
      this.mode = 'view';
   }
}
