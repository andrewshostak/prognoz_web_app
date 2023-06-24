import { Injectable } from '@angular/core';

import { MatchState } from '@enums/match-state.enum';
import { TeamMatch } from '@models/v2/team/team-match.model';
import { Team } from '@models/v2/team/team.model';
import { TeamParticipant } from '@models/v2/team/team-participant.model';
import { TeamPrediction } from '@models/v2/team/team-prediction.model';
import { DeviceService } from '@services/device.service';
import { TeamService } from '@services/v2/team/team.service';
import { TeamParticipantService } from '@services/v2/team/team-participant.service';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class TeamCompetitionService {
   constructor(
      private deviceService: DeviceService,
      private teamParticipantService: TeamParticipantService,
      private teamService: TeamService
   ) {}

   public updateTeamCreateAndUpdateCaptain(
      team: Team,
      competitionId: number,
      callbacks: { successful: () => void; error: () => void }
   ): void {
      this.makeTeamStatedRequest(team)
         .pipe(
            mergeMap(() => this.createTeamCaptainRequest(team, competitionId)),
            mergeMap((teamParticipant: TeamParticipant) => this.makeTeamParticipantConfirmedRequest(teamParticipant))
         )
         .subscribe(
            () => callbacks.successful(),
            () => callbacks.error()
         );
   }

   public static isTeamMatchGuessed(teamMatch: TeamMatch, prediction: TeamPrediction): boolean {
      if (teamMatch.match.state !== MatchState.Ended) {
         return false;
      }

      if (!prediction) {
         return false;
      }

      return teamMatch.match.home === prediction.home && teamMatch.match.away === prediction.away;
   }

   public static isTeamMatchBlocked(teamMatch: TeamMatch, prediction: TeamPrediction): boolean {
      if (teamMatch.match.state !== MatchState.Ended) {
         return false;
      }

      if (!prediction) {
         return false;
      }

      return !!prediction.blocked_by;
   }

   private createTeamCaptainRequest(team: Team, competitionId: number): Observable<TeamParticipant> {
      const teamParticipant = {
         captain: true,
         competition_id: competitionId,
         team_id: team.id,
         user_id: team.captain_id
      } as TeamParticipant;
      return from(this.deviceService.getDevice()).pipe(
         catchError(() => of(DeviceService.emptyDevice)),
         mergeMap((device: { fingerprint: string; info: { [key: string]: any } }) => {
            return this.teamParticipantService.createTeamParticipant(teamParticipant, device.fingerprint, device.info);
         })
      );
   }

   private makeTeamParticipantConfirmedRequest(teamParticipant: TeamParticipant): Observable<TeamParticipant> {
      teamParticipant.confirmed = true;
      return this.teamParticipantService.updateTeamParticipant(teamParticipant.id, teamParticipant);
   }

   private makeTeamStatedRequest(team: Team): Observable<Team> {
      return this.teamService.updateTeam(team.id, { ...team, stated: true, image: null });
   }
}
