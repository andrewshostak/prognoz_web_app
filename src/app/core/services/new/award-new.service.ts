import { Injectable } from '@angular/core';
import { AwardNew } from '@models/v2/award-new.model';

@Injectable()
export class AwardNewService {
   public static isChampionshipSeasonWinner(award: AwardNew): boolean {
      return award.id === 4;
   }
}
