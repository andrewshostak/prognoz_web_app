import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { TeamTeamMatchState } from '@enums/team-team-match-state.enum';
import { TeamTeamMatchSearch } from '@models/search/team/team-team-match-search.model';
import { TeamTeamMatch } from '@models/v2/team/team-team-match.model';
import { Pagination } from '@models/pagination.model';
import { OpenedModal } from '@models/opened-modal.model';
import { SettingsService } from '@services/settings.service';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { PaginationService } from '@services/pagination.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';
import { remove } from 'lodash';

@Component({
   selector: 'app-team-team-matches-table',
   templateUrl: './team-team-matches-table.component.html',
   styleUrls: ['./team-team-matches-table.component.scss']
})
export class TeamTeamMatchesTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public openedModal: OpenedModal<TeamTeamMatch>;
   public paginationData: Pagination;
   public teamTeamMatches: TeamTeamMatch[] = [];
   public teamTeamMatchStates = TeamTeamMatchState;

   constructor(
      private activatedRoute: ActivatedRoute,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService,
      private teamTeamMatchService: TeamTeamMatchNewService
   ) {}

   public deleteTeamTeamMatch(): void {
      this.teamTeamMatchService.deleteTeamTeamMatch(this.openedModal.data.id).subscribe(
         () => {
            remove(this.teamTeamMatches, this.openedModal.data);
            this.paginationData.total--;
            this.notificationsService.success(
               'Успішно',
               `Матч між командами ${this.openedModal.data.home_team.name} - ${this.openedModal.data.away_team.name} видалено`
            );
            this.openedModal.reference.close();
         },
         () => {
            this.openedModal.reference.close();
         }
      );
   }

   public ngOnDestroy(): void {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit(): void {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getTeamTeamMatchesData(params.pageNumber);
      });
   }

   public openDeleteConfirm(content: NgbModalRef | TemplateRef<any>, data: TeamTeamMatch, submitted: (event) => void): void {
      const message = `Ви впевнені що хочете видалити ${data.home_team.name} - ${data.away_team.name} ?`;
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this), message };
   }

   private getTeamTeamMatchesData(pageNumber: number): void {
      const search: TeamTeamMatchSearch = {
         page: pageNumber,
         orderBy: 'id',
         limit: SettingsService.teamTeamMatchesPerPage,
         sequence: Sequence.Descending,
         relations: ['homeTeam', 'awayTeam', 'teamStage']
      };
      this.teamTeamMatchService.getTeamTeamMatches(search).subscribe(response => {
         this.teamTeamMatches = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/team/team-matches/page/');
      });
   }
}
