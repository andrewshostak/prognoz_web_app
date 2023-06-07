import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { GuestbookMessageNewService } from '@app/guestbook/shared/guestbook-message-new.service';
import { ModelStatus } from '@enums/model-status.enum';
import { Sequence } from '@enums/sequence.enum';
import { GuestbookMessageNew } from '@models/v2/guestbook-message-new.model';
import { UserNew } from '@models/v2/user-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { GuestbookMessageSearch } from '@models/search/guestbook-message-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthNewService } from '@services/new/auth-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { TitleService } from '@services/title.service';
import { NotificationsService } from 'angular2-notifications';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-guestbook-page',
   templateUrl: './guestbook-page.component.html',
   styleUrls: ['./guestbook-page.component.scss']
})
export class GuestbookPageComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public authenticatedUser: UserNew;
   public guestbookMessages: GuestbookMessageNew[] = [];
   public openedModal: OpenedModal<number>;
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private guestbookMessageService: GuestbookMessageNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private titleService: TitleService
   ) {}

   public deleteGuestbookMessage(): void {
      this.guestbookMessageService.deleteGuestbookMessage(this.openedModal.data).subscribe(() => {
         this.openedModal.reference.close();
         this.notificationsService.success('Успішно', 'Повідомлення видалено');
         const index = this.guestbookMessages.findIndex(message => message.id === this.openedModal.data);
         if (index > -1) {
            this.guestbookMessages[index] = {
               ...this.guestbookMessages[index],
               body: null,
               deleted_by: this.authenticatedUser.id,
               deleter: this.authenticatedUser,
               deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
            };
         }
      });
   }

   public getGuestbookMessagesData(pageNumber: number): void {
      const search: GuestbookMessageSearch = {
         limit: SettingsService.guestbookMessagesPerPage,
         page: pageNumber,
         sequence: Sequence.Descending,
         trashed: ModelStatus.Truthy,
         orderBy: 'created_at',
         relations: ['user.clubs', 'user.winners.award', 'user.winners.competition.season', 'deleter']
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

   public openConfirmModal(data: number, content: NgbModalRef | TemplateRef<any>, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   public updateGuestbookMessage(message: GuestbookMessageNew): void {
      this.guestbookMessageService.updateGuestbookMessage(message.id, message).subscribe(response => {
         this.notificationsService.success('Успішно', 'Повідомлення змінено');
         const index = this.guestbookMessages.findIndex(m => m.id === message.id);
         if (index > -1) {
            this.guestbookMessages[index] = response;
         }
      });
   }
}
