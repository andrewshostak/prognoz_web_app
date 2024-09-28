import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { Match } from '@models/v2/match.model';
import { MatchState } from '@enums/match-state.enum';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { MatchSearch } from '@models/search/match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatchService } from '@services/api/v2/match.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { findIndex, pick, remove } from 'lodash';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-match-table',
   styleUrls: ['./match-table.component.scss'],
   templateUrl: './match-table.component.html'
})
export class MatchTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public clubsLogosPath: string;
   public updateInProgressMatchID: number | null = null;
   public matches: Match[];
   public matchStates = MatchState;
   public openedModal: OpenedModal<Match>;
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private matchService: MatchService,
      private notificationsService: NotificationsService,
      private ngbModalService: NgbModal
   ) {}

   public addResult(match: Match): void {
      this.updateInProgressMatchID = match.id;
      const toUpdate = pick(match, ['id', 'home', 'away', 'home_club_id', 'away_club_id', 'started_at']);
      this.matchService.updateMatch(toUpdate).subscribe(response => {
         this.notificationsService.success(
            'Успішно',
            `Результат в матчі №${match.id} ${match.club_home.title} - ${match.club_away.title} змінено`
         );
         const index = findIndex(this.matches, match);
         if (index > -1) {
            this.matches[index] = response;
         }
         this.updateInProgressMatchID = null;
      }, () => this.updateInProgressMatchID = null);
   }

   public deleteMatch(): void {
      this.matchService.deleteMatch(this.openedModal.data.id).subscribe(() => {
         remove(this.matches, this.openedModal.data);
         this.paginationData.total--;
         this.notificationsService.success(
            'Успішно',
            `Матч №${this.openedModal.data.id} ${this.openedModal.data.club_home.title} - ${this.openedModal.data.club_away.title} видалено`
         );
         this.openedModal.reference.close();
      });
   }

   public getMatchesData(pageNumber: number): void {
      const matchSearch: MatchSearch = {
         limit: PaginationService.perPage.matches,
         orderBy: 'state',
         page: pageNumber,
         sequence: Sequence.Ascending
      };
      this.matchService.getMatches(matchSearch).subscribe(response => {
         this.matches = response.data;
         this.paginationData = PaginationService.getPaginationData<Match>(response, '/manage/matches/page/');
      });
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit() {
      this.clubsLogosPath = SettingsService.imageBaseUrl.clubs;
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getMatchesData(params.pageNumber);
      });
   }

   public openConfirmModal(content: NgbModalRef | TemplateRef<Element>, data: Match, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }

   public showEditButton(match: Match): boolean {
      if (match.state === MatchState.Active) {
         return true;
      }

      const updatedAt: moment.Moment = moment(match.updated_at).add(MatchService.daysToUpdateMatchResult, 'day');
      const now: moment.Moment = moment();
      return updatedAt.isAfter(now);
   }
}
