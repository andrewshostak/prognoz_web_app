import { Injectable } from '@angular/core';
import { Award } from '@models/v2/award.model';

@Injectable()
export class AwardNewService {
   public static isChampionshipSeasonWinner(award: Award): boolean {
      return award.id === 4;
   }
}
