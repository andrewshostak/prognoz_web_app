import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';
import { CupMatch } from '@models/v2/cup/cup-match.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { CupMatchSearch } from '@models/search/cup/cup-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CupMatchService } from '@services/v2/cup/cup-match.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { remove } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-cup-match-table',
   styleUrls: ['./cup-match-table.component.scss'],
   templateUrl: './cup-match-table.component.html'
})
export class CupMatchTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public cupMatches: CupMatch[];
   public clubsLogosPath: string;
   public matchStates = MatchState;
   public openedModal: OpenedModal<CupMatch>;
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private cupMatchService: CupMatchService,
      private ngbModalService: NgbModal,
      private notificationsService: NotificationsService
   ) {}

   public deleteCupMatch(): void {
      this.cupMatchService.deleteCupMatch(this.openedModal.data.id).subscribe(() => {
         remove(this.cupMatches, this.openedModal.data);
         this.paginationData.total--;
         this.notificationsService.success(
            'Успішно',
            `Матч №${this.openedModal.data.id} ${this.openedModal.data.match.club_home.title} - ${this.openedModal.data.match.club_away.title} видалено`
         );
         this.openedModal.reference.close();
      });
   }

   public getCupMatchesData(pageNumber: number): void {
      const search: CupMatchSearch = {
         limit: SettingsService.cupMatchesPerPage,
         orderBy: 'started_at',
         page: pageNumber,
         relations: ['match.clubHome', 'match.clubAway', 'cupStages.competition'],
         sequence: Sequence.Descending
      };
      this.cupMatchService.getCupMatches(search).subscribe(response => {
         this.cupMatches = response.data;
         this.paginationData = PaginationService.getPaginationData<CupMatch>(response, '/manage/cup/matches/page/');
      });
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit(): void {
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getCupMatchesData(params.pageNumber);
      });
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: CupMatch, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
