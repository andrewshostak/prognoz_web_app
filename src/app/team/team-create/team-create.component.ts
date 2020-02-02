import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamNew } from '@models/new/team-new.model';
import { UserNew } from '@models/new/user-new.model';
import { AuthNewService } from '@services/new/auth-new.service';
import { TeamCompetitionNewService } from '@services/new/team-competition-new.service';
import { NotificationsService } from 'angular2-notifications';
import { get } from 'lodash';

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
      private teamCompetitionService: TeamCompetitionNewService,
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
      const callbacks = {
         successful: () => {
            this.notificationsService.success('Успішно', `Заявку в команду ${team.name} подано`);
            this.router.navigate(['/', 'team', 'competitions', competitionId, 'squads-new']);
         },
         error: () => this.router.navigate(['/', 'team', 'competitions', competitionId, 'squads-new'])
      };
      this.teamCompetitionService.updateTeamCreateAndUpdateCaptain(team, competitionId, callbacks);
   }
}
