import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { environment } from '@env';
import { Match } from '@models/match.model';
import { Pagination } from '@models/pagination.model';
import { MatchSearch } from '@models/search/match-search.model';
import { MatchService } from '@services/match.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-match-table',
   styleUrls: ['./match-table.component.scss'],
   templateUrl: './match-table.component.html'
})
export class MatchTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public clubImagesUrl: string;
   public matches: Match[];
   public paginationData: Pagination;

   constructor(private activatedRoute: ActivatedRoute, private matchService: MatchService) {}

   public getMatchesData(pageNumber: number): void {
      const matchSearch: MatchSearch = {
         limit: SettingsService.matchesPerPage,
         order_by: 'started_at',
         page: pageNumber,
         sequence: 'DESC'
      };
      this.matchService.getMatches(matchSearch).subscribe(response => {
         this.matches = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/matches/page/');
      });
   }

   public ngOnDestroy(): void {
      this.activatedRouteSubscription.unsubscribe();
   }

   public ngOnInit() {
      this.clubImagesUrl = environment.apiImageClubs;
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getMatchesData(params.pageNumber);
      });
   }
}
