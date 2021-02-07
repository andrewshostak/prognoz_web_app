import { Component, Input } from '@angular/core';

import { Comment } from '@models/comment.model';
import { GuestbookMessage } from '@models/guestbook-message.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
   selector: 'app-user-message',
   templateUrl: './user-message.component.html',
   styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent {
   constructor(private domSanitizer: DomSanitizer) {}

   @Input() message: Comment | GuestbookMessage;

   assembleHTMLItem(message: string) {
      return this.domSanitizer.bypassSecurityTrustHtml(message);
   }

   // todo: remove
}
