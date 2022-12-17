import { Injectable } from '@angular/core';

import { MatchState } from '@enums/match-state.enum';
import { TeamMatchNew } from '@models/new/team-match-new.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { TeamPredictionNew } from '@models/new/team-prediction-new.model';
import { DeviceService } from '@services/device.service';
import { TeamNewService } from '@services/new/team-new.service';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class TeamCompetitionNewService {
   constructor(
      private deviceService: DeviceService,
      private teamParticipantService: TeamParticipantNewService,
      private teamService: TeamNewService
   ) {}

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
         .subscribe(
            () => callbacks.successful(),
            () => callbacks.error()
         );
   }

   public static isTeamMatchGuessed(teamMatch: TeamMatchNew, prediction: TeamPredictionNew): boolean {
      if (teamMatch.match.state !== MatchState.Ended) {
         return false;
      }

      if (!prediction) {
         return false;
      }

      return teamMatch.match.home === prediction.home && teamMatch.match.away === prediction.away;
   }

   public static isTeamMatchBlocked(teamMatch: TeamMatchNew, prediction: TeamPredictionNew): boolean {
      if (teamMatch.match.state !== MatchState.Ended) {
         return false;
      }

      if (!prediction) {
         return false;
      }

      return !!prediction.blocked_by;
   }

   private createTeamCaptainRequest(team: TeamNew, competitionId: number): Observable<TeamParticipantNew> {
      const teamParticipant = {
         captain: true,
         competition_id: competitionId,
         team_id: team.id,
         user_id: team.captain_id
      } as TeamParticipantNew;
      return from(this.deviceService.getDevice()).pipe(
         catchError(() => of(DeviceService.emptyDevice)),
         mergeMap((device: { fingerprint: string; info: { [key: string]: any } }) => {
            return this.teamParticipantService.createTeamParticipant(teamParticipant, device.fingerprint, device.info);
         })
      );
   }

   private makeTeamParticipantConfirmedRequest(teamParticipant: TeamParticipantNew): Observable<TeamParticipantNew> {
      teamParticipant.confirmed = true;
      return this.teamParticipantService.updateTeamParticipant(teamParticipant.id, teamParticipant);
   }

   private makeTeamStatedRequest(team: TeamNew): Observable<TeamNew> {
      return this.teamService.updateTeam(team.id, { ...team, stated: true, image: null });
   }
}
