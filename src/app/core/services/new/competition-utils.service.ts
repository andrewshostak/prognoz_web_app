import { Injectable } from '@angular/core';

import { CompetitionNew } from '@models/new/competition-new.model';

@Injectable()
export class CompetitionUtilsService {
   public static getTotalNumberOfRounds(numberOfTeams: number): number {
      return numberOfTeams * 2 - 2;
   }

   public static getTeamNextRoundNumber(competition: CompetitionNew): number | null {
      if (!competition.active_round) {
         return 1;
      } else if (competition.active_round === CompetitionUtilsService.getTotalNumberOfRounds(competition.number_of_teams)) {
         return null;
      }

      return competition.active_round + 1;
   }
}
