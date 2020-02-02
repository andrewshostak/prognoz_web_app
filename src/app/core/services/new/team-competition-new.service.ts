import { Injectable } from '@angular/core';

import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TeamCompetitionNewService {
   constructor(private teamParticipantService: TeamParticipantNewService, private teamService: TeamNewService) {}

   public updateTeamCreateAndUpdateCaptain(
      team: TeamNew,
      competitionId: number,
      callbacks: { successful: () => any; error: () => any }
   ): void {
      this.makeTeamStatedRequest(team)
         .pipe(
            mergeMap(() => this.createTeamCaptainRequest(team, competitionId)),
            mergeMap((teamParticipant: TeamParticipantNew) => this.makeTeamParticipantConfirmedRequest(teamParticipant))
         )
         .subscribe(() => callbacks.successful(), () => callbacks.error());
   }

   private createTeamCaptainRequest(team: TeamNew, competitionId: number): Observable<TeamParticipantNew> {
      const teamParticipant = {
         captain: true,
         competition_id: competitionId,
         team_id: team.id,
         user_id: team.captain_id
      } as TeamParticipantNew;
      return this.teamParticipantService.createTeamParticipant(teamParticipant);
   }

   private makeTeamParticipantConfirmedRequest(teamParticipant: TeamParticipantNew): Observable<TeamParticipantNew> {
      teamParticipant.confirmed = true;
      return this.teamParticipantService.updateTeamParticipant(teamParticipant.id, teamParticipant);
   }

   private makeTeamStatedRequest(team: TeamNew): Observable<TeamNew> {
      return this.teamService.updateTeam(team.id, { ...team, stated: true, image: null });
   }
}
