import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { MatchState } from '@enums/match-state.enum';
import { ChampionshipMatch } from '@models/v2/championship/championship-match.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { ChampionshipMatchSearch } from '@models/search/championship/championship-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipMatchService } from '@services/v2/championship/championship-match.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { remove } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-championship-match-table',
   styleUrls: ['./championship-match-table.component.scss'],
   templateUrl: './championship-match-table.component.html'
})
export class ChampionshipMatchTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public championshipMatches: ChampionshipMatch[];
   public clubsLogosPath: string;
   public matchStates = MatchState;
   public openedModal: OpenedModal<ChampionshipMatch>;
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipMatchService: ChampionshipMatchService,
      private notificationsService: NotificationsService,
      private ngbModalService: NgbModal
   ) {}

   public deleteChampionshipMatch(): void {
      this.championshipMatchService.deleteChampionshipMatch(this.openedModal.data.id).subscribe(() => {
         remove(this.championshipMatches, this.openedModal.data);
         this.paginationData.total--;
         this.notificationsService.success(
            'Успішно',
            `Матч №${this.openedModal.data.id} ${this.openedModal.data.match.club_home.title} - ${this.openedModal.data.match.club_away.title} видалено`
         );
         this.openedModal.reference.close();
      });
   }

   public getChampionshipMatchesData(pageNumber: number): void {
      const search: ChampionshipMatchSearch = {
         limit: SettingsService.championshipMatchesPerPage,
         orderBy: 'started_at',
         page: pageNumber,
         sequence: Sequence.Descending
      };
      this.championshipMatchService.getChampionshipMatches(search).subscribe(response => {
         this.championshipMatches = response.data;
         this.paginationData = PaginationService.getPaginationData<ChampionshipMatch>(response, '/manage/championship/matches/page/');
      });
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit(): void {
      this.clubsLogosPath = SettingsService.clubsLogosPath + '/';
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getChampionshipMatchesData(params.pageNumber);
      });
   }

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: ChampionshipMatch, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
