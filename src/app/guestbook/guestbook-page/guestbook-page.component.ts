import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { GuestbookMessageNewService } from '@app/guestbook/shared/guestbook-message-new.service';
import { Sequence } from '@enums/sequence.enum';
import { GuestbookMessageNew } from '@models/new/guestbook-message-new.model';
import { Pagination } from '@models/pagination.model';
import { GuestbookMessageSearch } from '@models/search/guestbook-message-search.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { Subscription } from 'rxjs';
import { UserNew } from '@models/new/user-new.model';

@Component({
   selector: 'app-guestbook-page',
   templateUrl: './guestbook-page.component.html',
   styleUrls: ['./guestbook-page.component.scss']
})
export class GuestbookPageComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public authenticatedUser: UserNew;
   public guestbookMessages: GuestbookMessageNew[] = [];
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private guestbookMessageService: GuestbookMessageNewService,
      private titleService: TitleService
   ) {}

   public getGuestbookMessagesData(pageNumber: number): void {
      const search: GuestbookMessageSearch = {
         limit: SettingsService.guestbookMessagesPerPage,
         page: pageNumber,
         sequence: Sequence.Descending,
         orderBy: 'created_at',
         relations: ['user.clubs', 'user.winners.award', 'user.winners.competition.season']
      };
      this.guestbookMessageService.getGuestbookMessages(search).subscribe(response => {
         this.guestbookMessages = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/guestbook/page/');
      });
   }

   public messageCreated(message: GuestbookMessageNew): void {
      message.is_changeable = true;
      this.guestbookMessages = [message, ...this.guestbookMessages];
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit() {
      this.titleService.setTitle('Гостьова сторінка');

      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getGuestbookMessagesData(params.pageNumber);
      });

      this.authenticatedUser = this.authService.getUser();
   }
}
