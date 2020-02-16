import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { TeamParticipantSearch } from '@models/search/team-participant-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { remove } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-team-participants-table',
   styleUrls: ['./team-participants-table.component.scss'],
   templateUrl: './team-participants-table.component.html'
})
export class TeamParticipantsTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public confirmModalMessage: string;
   public confirmModalSubmit: (event) => void;
   public openedModal: OpenedModal<TeamParticipantNew>;
   public paginationData: Pagination;
   public teamParticipants: TeamParticipantNew[];

   constructor(
      private activatedRoute: ActivatedRoute,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamParticipantNewService: TeamParticipantNewService
   ) {}

   public getTeamParticipantsData(pageNumber: number): void {
      const search: TeamParticipantSearch = {
         limit: SettingsService.teamParticipantsPerPage,
         page: pageNumber
      };
      this.teamParticipantNewService.getTeamParticipants(search).subscribe(response => {
         this.teamParticipants = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/team/participants/page/');
      });
   }

   public deleteTeamParticipant(): void {
      this.teamParticipantNewService.deleteTeamParticipant(this.openedModal.data.id).subscribe(
         () => {
            remove(this.teamParticipants, this.openedModal.data);
            this.paginationData.total--;
            this.notificationsService.success('Успішно', `Заявку №${this.openedModal.data.id} ${this.openedModal.data.user.name} видалено`);
            this.openedModal.reference.close();
         },
         () => {
            this.openedModal.reference.close();
         }
      );
   }

   public ngOnDestroy() {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit() {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getTeamParticipantsData(params.number);
      });
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: TeamParticipantNew, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
