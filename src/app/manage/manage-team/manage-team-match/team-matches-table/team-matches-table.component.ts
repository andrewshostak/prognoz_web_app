import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { TeamMatchNew } from '@models/new/team-match-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { TeamMatchSearch } from '@models/search/team-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TeamMatchNewService } from '@services/new/team-match-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { remove } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-team-matches-table',
   styleUrls: ['./team-matches-table.component.scss'],
   templateUrl: './team-matches-table.component.html'
})
export class TeamMatchesTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public clubsLogosPath: string;
   public openedModal: OpenedModal<TeamMatchNew>;
   public teamMatches: TeamMatchNew[];
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private teamMatchService: TeamMatchNewService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   public deleteTeamMatch(): void {
      this.teamMatchService.deleteTeamMatch(this.openedModal.data.id).subscribe(
         () => {
            remove(this.teamMatches, this.openedModal.data);
            this.paginationData.total--;
            this.notificationsService.success(
               'Успішно',
               `Матч №${this.openedModal.data.id} ${this.openedModal.data.match.club_home.title} - ${this.openedModal.data.match.club_away.title} видалено`
            );
            this.openedModal.reference.close();
         },
         () => {
            this.openedModal.reference.close();
         }
      );
   }

   public getTeamMatchesData(pageNumber: number): void {
      const search: TeamMatchSearch = {
         limit: SettingsService.teamMatchesPerPage,
         orderBy: 'started_at',
         page: pageNumber,
         relations: ['match.clubHome', 'match.clubAway', 'teamStages.competition'],
         sequence: Sequence.Descending
      };
      this.teamMatchService.getTeamMatches(search).subscribe(response => {
         this.teamMatches = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/team/matches/page/');
      });
   }

   public ngOnDestroy(): void {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit(): void {
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getTeamMatchesData(params.pageNumber);
      });
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: TeamMatchNew, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
