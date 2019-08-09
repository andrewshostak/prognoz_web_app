import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TeamNew } from '@models/new/team-new.model';
import { Pagination } from '@models/pagination.model';
import { TeamSearch } from '@models/search/team-search.model';
import { TeamNewService } from '@services/new/team-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-team-teams-table',
   styleUrls: ['./team-teams-table.component.scss'],
   templateUrl: './team-teams-table.component.html'
})
export class TeamTeamsTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public paginationData: Pagination;
   public teams: TeamNew[];

   constructor(private activatedRoute: ActivatedRoute, private teamService: TeamNewService) {}

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
}
