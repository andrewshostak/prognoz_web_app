import { Component, Input, OnInit } from '@angular/core';
import { CommentNew } from '@models/new/comment-new.model';
import { GuestbookMessageNew } from '@models/new/guestbook-message-new.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Win } from '@models/win.model';
import { groupBy } from 'lodash';
import { SettingsService } from '@services/settings.service';
import { AwardNewService } from '@services/new/award-new.service';
import { UserNew } from '@models/new/user-new.model';

@Component({
   selector: 'app-user-message-new',
   templateUrl: './user-message-new.component.html',
   styleUrls: ['./user-message-new.component.scss']
})
export class UserMessageNewComponent implements OnInit {
   @Input() message: GuestbookMessageNew | CommentNew;
   @Input() authenticatedUser: UserNew;
   @Input() permissionForDeleting: string;

   public awardsLogosPath = SettingsService.awardsLogosPath;
   public groupedWins: { [awardId: number]: Win[] };
   public isChampionshipSeasonWinner = AwardNewService.isChampionshipSeasonWinner;

   constructor(private domSanitizer: DomSanitizer) {}

   public assembleHTMLItem(message: string): SafeHtml {
      return this.domSanitizer.bypassSecurityTrustHtml(message);
   }

   public ngOnInit(): void {
      this.groupedWins = groupBy(this.message.user.winners, 'award_id') as any;
   }
}
