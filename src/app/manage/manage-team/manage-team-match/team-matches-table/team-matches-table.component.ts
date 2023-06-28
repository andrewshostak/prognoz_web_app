import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';
import { TeamMatch } from '@models/v2/team/team-match.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { TeamMatchSearch } from '@models/search/team/team-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TeamMatchService } from '@services/v2/team/team-match.service';
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
   public matchStates = MatchState;
   public openedModal: OpenedModal<TeamMatch>;
   public teamMatches: TeamMatch[];
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private teamMatchService: TeamMatchService,
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
         limit: PaginationService.perPage.teamMatches,
         orderBy: 'started_at',
         page: pageNumber,
         relations: ['match.clubHome', 'match.clubAway', 'teamStages.competition'],
         sequence: Sequence.Descending
      };
      this.teamMatchService.getTeamMatches(search).subscribe(response => {
         this.teamMatches = response.data;
         this.paginationData = PaginationService.getPaginationData<TeamMatch>(response, '/manage/team/matches/page/');
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

   public openConfirmModal(content: NgbModalRef | TemplateRef<Element>, data: TeamMatch, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
