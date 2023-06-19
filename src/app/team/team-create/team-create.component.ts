import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Team } from '@models/v2/team/team.model';
import { User } from '@models/v2/user.model';
import { AuthService } from '@services/v2/auth.service';
import { TeamCompetitionService } from '@services/v2/team/team-competition.service';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';

@Component({
   selector: 'app-team-create',
   templateUrl: './team-create.component.html',
   styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
   public user: User;

   constructor(
      private activatedRoute: ActivatedRoute,
      private authService: AuthService,
      private notificationsService: NotificationsService,
      private teamCompetitionService: TeamCompetitionService,
      private router: Router
   ) {}

   public ngOnInit(): void {
      this.user = this.authService.getUser();
   }

   public successfullySubmitted(team: Team): void {
      const competitionId = get(this.activatedRoute, 'snapshot.params.createParticipantForCompetition');
      if (competitionId) {
         this.afterCreateActions(team, competitionId);
         return;
      }

      this.router.navigate(['/', 'team', team.id, 'edit']);
   }

   private afterCreateActions(team: Team, competitionId: number): void {
      const callbacks = {
         successful: () => {
            this.notificationsService.success('Успішно', `Заявку в команду ${team.name} подано`);
            this.router.navigate(['/', 'team', 'participants', { competition_id: competitionId }]);
         },
         error: () => this.router.navigate(['/', 'team', 'participants', { competition_id: competitionId }])
      };
      this.teamCompetitionService.updateTeamCreateAndUpdateCaptain(team, competitionId, callbacks);
   }
}
