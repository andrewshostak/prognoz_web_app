import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { ChampionshipMatchNew } from '@models/championship/championship-match-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { Pagination } from '@models/pagination.model';
import { ChampionshipMatchSearch } from '@models/search/championship-match-search.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChampionshipMatchNewService } from '@services/championship/championship-match-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { NotificationsService } from 'angular2-notifications';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-championship-match-table',
   styleUrls: ['./championship-match-table.component.scss'],
   templateUrl: './championship-match-table.component.html'
})
export class ChampionshipMatchTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public championshipMatches: ChampionshipMatchNew[];
   public clubsLogosPath: string;
   public openedModal: OpenedModal<ChampionshipMatchNew>;
   public paginationData: Pagination;

   constructor(
      private activatedRoute: ActivatedRoute,
      private championshipMatchService: ChampionshipMatchNewService,
      private notificationsService: NotificationsService,
      private ngbModalService: NgbModal
   ) {}

   public deleteChampionshipMatch(): void {}

   public getChampionshipMatchesData(pageNumber: number): void {
      const search: ChampionshipMatchSearch = {
         limit: SettingsService.championshipMatchesPerPage,
         orderBy: 'started_at',
         page: pageNumber,
         sequence: Sequence.Descending
      };
      this.championshipMatchService.getChampionshipMatches(search).subscribe(response => {
         this.championshipMatches = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/championship/matches/page/');
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

   public openConfirmModal(content: NgbModalRef | HTMLElement, data: ChampionshipMatchNew, submitted: (event) => void): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this) };
   }
}
