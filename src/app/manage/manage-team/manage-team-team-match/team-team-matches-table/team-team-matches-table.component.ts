import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { TeamTeamMatchSearch } from '@models/search/team-team-match-search.model';
import { SettingsService } from '@services/settings.service';
import { Sequence } from '@enums/sequence.enum';
import { TeamTeamMatchNewService } from '@services/new/team-team-match-new.service';
import { TeamTeamMatchNew } from '@models/new/team-team-match-new.model';
import { Pagination } from '@models/pagination.model';
import { PaginationService } from '@services/pagination.service';

@Component({
   selector: 'app-team-team-matches-table',
   templateUrl: './team-team-matches-table.component.html',
   styleUrls: ['./team-team-matches-table.component.scss']
})
export class TeamTeamMatchesTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public paginationData: Pagination;
   public teamTeamMatches: TeamTeamMatchNew[] = [];

   constructor(private activatedRoute: ActivatedRoute, private teamTeamMatchService: TeamTeamMatchNewService) {}

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
