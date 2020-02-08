import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RequestParams } from '@models/request-params.model';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamTeamMatch } from '@models/team/team-team-match.model';
import { Team } from '@models/team/team.model';
import { User } from '@models/user.model';
import { CurrentStateService } from '@services/current-state.service';
import { TeamMatchService } from '@services/team/team-match.service';
import { TeamTeamMatchService } from '@services/team/team-team-match.service';
import { TeamService } from '@services/team/team.service';
import { TitleService } from '@services/title.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-team-my',
   templateUrl: './team-my.component.html',
   styleUrls: ['./team-my.component.scss']
})
export class TeamMyComponent implements OnInit, OnDestroy {
   public authenticatedUser: User;
   public competitionId: number;
   public errorTeam: string;
   public errorTeamTeamMatches: string;
   public isCaptain = false;
   public noAccess = 'Доступ заборонено. Увійдіть на сайт для перегляду цієї сторінки.';
   public routerEventsSubscription: Subscription;
   public round: number;
   public roundsArray: Array<{ id: number; title: string }>;
   public team: Team;
   public teamMatches: TeamMatch[];
   public teamTeamMatches: TeamTeamMatch[];
   constructor(
      private currentStateService: CurrentStateService,
      private router: Router,
      private teamMatchService: TeamMatchService,
      private teamService: TeamService,
      private teamTeamMatchService: TeamTeamMatchService,
      private titleService: TitleService
   ) {
      this.subscribeToRouterEvents();
   }

   public getTeamTeamMatchesData(competitionId: number, round?: number) {
      const params: RequestParams[] = [{ parameter: 'competition_id', value: this.competitionId.toString() }];
      if (round) {
         params.push({ parameter: 'page', value: round.toString() });
      }
      this.teamTeamMatchService.getTeamTeamMatches(params).subscribe(
         response => {
            this.errorTeamTeamMatches = null;
            if (!response) {
               this.teamTeamMatches = null;
               return;
            }

            if (!this.round) {
               this.round = response.current_page;
            }

            this.teamTeamMatches = response.data;
            this.roundsArray = UtilsService.createRoundsArrayFromTeamsQuantity(response.per_page * 2);
         },
         error => {
            this.errorTeamTeamMatches = error;
            this.teamTeamMatches = null;
         }
      );
   }

   public ngOnDestroy() {
      if (!this.routerEventsSubscription.closed) {
         this.routerEventsSubscription.unsubscribe();
      }
   }

   public ngOnInit() {
      this.titleService.setTitle('Вибір статегії і воротаря - Командний');
      this.authenticatedUser = this.currentStateService.getUser();
      this.urlChanged(this.router.url);
   }

   private getTeamData(competitionId: number) {
      const params = [
         { parameter: 'user_id', value: this.authenticatedUser.id.toString() },
         { parameter: 'competition_id', value: competitionId.toString() }
      ];
      this.teamService.getTeam(null, params).subscribe(
         response => {
            this.errorTeam = null;
            if (!response) {
               this.team = null;
               return;
            }

            this.team = Object.assign({}, response);
            if (this.team.captain_id !== this.authenticatedUser.id) {
               return;
            }

            this.isCaptain = true;
         },
         error => {
            this.errorTeam = error;
            this.team = null;
         }
      );
   }

   private subscribeToRouterEvents(): void {
      this.routerEventsSubscription = this.router.events.subscribe(event => {
         if (event instanceof NavigationEnd) {
            this.urlChanged(event.url);
         }
      });
   }

   private urlChanged(url: string): void {
      const urlAsArray = url.split('/');

      const temporaryCompetitionsIndex = urlAsArray.findIndex(item => item === 'competitions');
      if (temporaryCompetitionsIndex > -1) {
         this.competitionId = parseInt(urlAsArray[temporaryCompetitionsIndex + 1], 10);
      }

      const temporaryRoundIndex = urlAsArray.findIndex(item => item === 'round');
      if (temporaryRoundIndex > -1) {
         this.round = parseInt(urlAsArray[temporaryRoundIndex + 1], 10);
      }

      if (!this.competitionId) {
         return;
      }

      if (!this.authenticatedUser) {
         return;
      }

      this.getTeamData(this.competitionId);
      this.getTeamTeamMatchesData(this.competitionId, this.round);
   }
}
