import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CommentNew } from '@models/new/comment-new.model';
import { GuestbookMessageNew } from '@models/new/guestbook-message-new.model';
import { UserNew } from '@models/new/user-new.model';
import { Win } from '@models/win.model';
import { SettingsService } from '@services/settings.service';
import { AwardNewService } from '@services/new/award-new.service';
import { groupBy } from 'lodash';

@Component({
   selector: 'app-user-message-new',
   templateUrl: './user-message-new.component.html',
   styleUrls: ['./user-message-new.component.scss']
})
export class UserMessageNewComponent implements OnInit {
   @Input() message: GuestbookMessageNew | CommentNew;
   @Input() authenticatedUser: UserNew;
   @Input() permissionForDeleting: string;
   @Output() onDeleteButtonClick = new EventEmitter<number>();
   @Output() onUpdateButtonClick = new EventEmitter<GuestbookMessageNew | CommentNew>();

   public awardsLogosPath = SettingsService.awardsLogosPath;
   public groupedWins: { [awardId: number]: Win[] };
   public isChampionshipSeasonWinner = AwardNewService.isChampionshipSeasonWinner;
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

   public ngOnInit(): void {
      this.groupedWins = groupBy(this.message.user.winners, 'award_id') as any;
   }

   public updateButtonClick(): void {
      if (this.messageEditForm.invalid) {
         return;
      }
      this.onUpdateButtonClick.emit({ ...this.message, body: this.messageEditForm.get('body').value });
      this.mode = 'view';
   }
}
