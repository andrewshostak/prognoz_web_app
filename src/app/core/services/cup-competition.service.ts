import { Injectable } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { CupCupMatch } from '@models/v2/cup/cup-cup-match.model';
import { CurrentStateService } from '@services/current-state.service';
import { groupBy } from 'lodash';

@Injectable()
export class CupCompetitionService {
   constructor(private currentStateService: CurrentStateService) {}

   public groupCupCupMatches(cupCupMatches: CupCupMatch[]): CupCupMatch[][] {
      const groupedCupCupMatches = Object.values(
         groupBy<CupCupMatch>(cupCupMatches, 'group_number') as {
            [groupNumber: number]: CupCupMatch[];
         }
      );

      const user = this.currentStateService.getUser();
      if (!user) {
         return groupedCupCupMatches;
      }

      const userGroupIndex = groupedCupCupMatches.findIndex((ccMatches: CupCupMatch[]) =>
         ccMatches
            .map(cupCupMatch => [cupCupMatch.home_user_id, cupCupMatch.away_user_id])
            .flat()
            .includes(user.id)
      );

      if (userGroupIndex < 0) {
         return groupedCupCupMatches;
      }

      const userGroupCupCupMatches = groupedCupCupMatches.splice(userGroupIndex, 1).flat();
      const userGroupSortedCupCupMatches = this.sortCupCupMatchesByUserId(userGroupCupCupMatches, user.id);
      groupedCupCupMatches.unshift(userGroupSortedCupCupMatches);

      return groupedCupCupMatches;
   }

   public groupCupCupMatchesByStage(cupCupMatches: CupCupMatch[], sequence: Sequence): CupCupMatch[][] {
      return Object.values(
         groupBy<CupCupMatch>(cupCupMatches, 'cup_stage_id') as {
            [cupStageId: number]: CupCupMatch[];
         }
      ).sort((a, b) => {
         return sequence === Sequence.Ascending
            ? a[0].cup_stage_id > b[0].cup_stage_id
               ? 1
               : -1
            : a[0].cup_stage_id > b[0].cup_stage_id
            ? -1
            : 1;
      });
   }

   public sortCupCupMatches(cupCupMatches: CupCupMatch[]): CupCupMatch[] {
      const user = this.currentStateService.getUser();
      if (!user) {
         return cupCupMatches.sort(this.sortByIdFunc);
      }

      return this.sortCupCupMatchesByUserId(cupCupMatches, user.id);
   }

   private sortByIdFunc(a: CupCupMatch, b: CupCupMatch): number {
      return a.id < b.id ? -1 : 1;
   }

   private sortCupCupMatchesByUserId(cupCupMatches: CupCupMatch[], userId: number): CupCupMatch[] {
      return cupCupMatches.sort((a, b) => {
         if ([a.home_user_id, a.away_user_id].includes(userId)) {
            return -1;
         }
         if ([b.home_user_id, b.away_user_id].includes(userId)) {
            return 1;
         }

         return this.sortByIdFunc(a, b);
      });
   }
}
