import { Injectable } from '@angular/core';

import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;
   public static readonly championshipMatchesPerPage: number = 10;
   public static readonly matchesPerPage: number = 12;
   public static readonly newInterceptorPaths: string[] = ['v2/championship/matches', 'v2/matches', 'v2/competitions'];

   public static readonly clubsLogosPath: string = environment.imageURL + '/clubs';

   public static readonly maxLimitValues = {
      championshipMatches: 100,
      championshipPredictions: 150,
      championshipRating: 200,

      cupCupMatches: 10,
      cupMatches: 50,
      cupStages: 10,

      teamMatches: 20,
      teamParticipants: 10,
      teamPredictions: 10,
      teamTeamMatches: 10,

      clubs: 500,
      competitions: 100,
      guestbook: 20,
      matches: 100,
      news: 10
   };
}
