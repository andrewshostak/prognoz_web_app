import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ClubService } from '@services/club.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { ClubNewService } from '@services/new/club-new.service';
import { ClubNew } from '@models/new/club-new.model';
import { Subscription } from 'rxjs';
import { ClubSearch } from '@models/search/club-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';
import { Pagination } from '@models/pagination.model';
import { PaginationService } from '@services/pagination.service';
import { OpenedModal } from '@models/opened-modal.model';
import { remove } from 'lodash';

@Component({
   selector: 'app-club-table',
   templateUrl: './club-table.component.html',
   styleUrls: ['./club-table.component.scss']
})
export class ClubTableComponent implements OnDestroy, OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private clubService: ClubService,
      private clubNewService: ClubNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   public activatedRouteSubscription: Subscription;
   public clubs: ClubNew[];
   public openedModal: OpenedModal<ClubNew>;
   public paginationData: Pagination;

   public deleteClub(): void {
      this.clubService.deleteClub(this.openedModal.data.id).subscribe(
         () => {
            remove(this.clubs, this.openedModal.data);
            this.paginationData.total--;
            this.notificationsService.success('Успішно', `${this.openedModal.data.title} видалено`);
            this.openedModal.reference.close();
         },
         errors => {
            // todo: remove after moving to v2 endpoint
            for (const error of errors) {
               this.notificationsService.error('Помилка', error);
            }
         }
      );
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit(): void {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getClubsData(params.pageNumber);
      });
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: ClubNew, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   private getClubsData(pageNumber: number): void {
      const search: ClubSearch = {
         limit: SettingsService.clubsPerPage,
         orderBy: 'title',
         page: pageNumber,
         sequence: Sequence.Ascending,
         relations: ['parent']
      };
      this.clubNewService.getClubs(search).subscribe(response => {
         this.clubs = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/clubs/page/');
      });
   }
}
