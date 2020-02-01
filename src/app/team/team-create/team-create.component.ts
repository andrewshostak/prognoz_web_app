import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-team-create',
   templateUrl: './team-create.component.html',
   styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
   public user: UserNew;

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthNewService,
      private notificationsService: NotificationsService,
      private teamParticipantService: TeamParticipantNewService,
      private teamService: TeamNewService,
      private router: Router
   ) {}

   public ngOnInit(): void {
      this.user = this.authService.getUser();
   }

   public successfullySubmitted(team: TeamNew): void {
      const competitionId = get(this.activatedRoute, 'snapshot.params.createParticipantForCompetition');
      if (competitionId) {
         this.afterCreateActions(team, competitionId);
         return;
      }

      this.router.navigate(['/', 'team', team.id, 'edit']);
   }

   private afterCreateActions(team: TeamNew, competitionId: number): void {
      this.updateTeamRequest(team)
         .pipe(
            mergeMap(() => this.createTeamParticipantRequest(team, competitionId)),
            mergeMap((teamParticipant: TeamParticipantNew) => this.updateTeamParticipantRequest(teamParticipant))
         )
         .subscribe(
            () => {
               this.notificationsService.success('Успішно', `Заявку в команду ${team.name} подано`);
               this.router.navigate(['/', 'team', 'competitions', competitionId, 'squads-new']);
            },
            () => {
               this.router.navigate(['/', 'team', 'competitions', competitionId, 'squads-new']);
            }
         );
   }

   private createTeamParticipantRequest(team: TeamNew, competitionId: number): Observable<TeamParticipantNew> {
      const teamParticipant = {
         captain: true,
         competition_id: competitionId,
         team_id: team.id,
         user_id: team.captain_id
      } as TeamParticipantNew;
      return this.teamParticipantService.createTeamParticipant(teamParticipant);
   }

   private updateTeamParticipantRequest(teamParticipant: TeamParticipantNew): Observable<TeamParticipantNew> {
      teamParticipant.confirmed = true;
      return this.teamParticipantService.updateTeamParticipant(teamParticipant.id, teamParticipant);
   }

   private updateTeamRequest(team: TeamNew): Observable<TeamNew> {
      return this.teamService.updateTeam(team.id, { ...team, stated: true, image: null });
   }
}
