import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Team } from '@models/v2/team/team.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { TeamSearch } from '@models/search/team/team-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TeamNewService } from '@services/new/team-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { remove } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-team-teams-table',
   styleUrls: ['./team-teams-table.component.scss'],
   templateUrl: './team-teams-table.component.html'
})
export class TeamTeamsTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public openedModal: OpenedModal<Team>;
   public paginationData: Pagination;
   public teams: Team[];

   constructor(
      private activatedRoute: ActivatedRoute,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamService: TeamNewService
   ) {}

   public deleteTeam(): void {
      this.teamService.deleteTeam(this.openedModal.data.id).subscribe(
         () => {
            remove(this.teams, this.openedModal.data);
            this.paginationData.total--;
            this.notificationsService.success('Успішно', `Команду ${this.openedModal.data.name} видалено`);
            this.openedModal.reference.close();
         },
         () => {
            this.openedModal.reference.close();
         }
      );
   }

   public getTeamsData(pageNumber: number): void {
      const search: TeamSearch = {
         limit: SettingsService.teamsPerPage,
         page: pageNumber
      };
      this.teamService.getTeams(search).subscribe(response => {
         this.teams = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/team/teams/page/');
      });
   }

   public ngOnDestroy(): void {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit(): void {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getTeamsData(params.pageNumber);
      });
   }

   public openConfirmModal(content: NgbModalRef | TemplateRef<any>, data: Team, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
