import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Sequence } from '@enums/sequence.enum';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { Pagination } from '@models/pagination.model';
import { TeamStageSearch } from '@models/search/team-stage-search.model';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { PaginationService } from '@services/pagination.service';
import { SettingsService } from '@services/settings.service';

import { Subscription } from 'rxjs';
import { TeamStageState } from '@enums/team-stage-state.enum';

@Component({
   selector: 'app-team-stages-table',
   templateUrl: './team-stages-table.component.html',
   styleUrls: ['./team-stages-table.component.scss']
})
export class TeamStagesTableComponent implements OnDestroy, OnInit {
   public activatedRouteSubscription: Subscription;
   public teamStages: TeamStageNew[] = [];
   public paginationData: Pagination;
   public teamStageTypes = TeamStageState;

   constructor(private activatedRoute: ActivatedRoute, private teamStageService: TeamStageNewService) {}

   public getTeamStagesData(pageNumber: number): void {
      const search: TeamStageSearch = {
         page: pageNumber,
         orderBy: 'state',
         limit: SettingsService.teamsStagesPerPage,
         sequence: Sequence.Ascending,
         relations: ['competition', 'teamStageType']
      };
      this.teamStageService.getTeamStages(search).subscribe(response => {
         this.teamStages = response.data;
         this.paginationData = PaginationService.getPaginationData(response, '/manage/team/stages/page/');
      });
   }

   public ngOnDestroy(): void {
      if (!this.activatedRouteSubscription.closed) {
         this.activatedRouteSubscription.unsubscribe();
      }
   }

   public ngOnInit(): void {
      this.activatedRouteSubscription = this.activatedRoute.params.subscribe((params: Params) => {
         this.getTeamStagesData(params.pageNumber);
      });
   }
}
