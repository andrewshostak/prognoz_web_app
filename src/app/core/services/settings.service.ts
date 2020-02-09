import { Injectable } from '@angular/core';

import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;

   // pagination
   public static readonly championshipMatchesPerPage: number = 10;
   public static readonly cupMatchesPerPage: number = 16;
   public static readonly matchesPerPage: number = 12;
   public static readonly teamMatchesPerPage: number = 12;
   public static readonly teamsPerPage: number = 10;
   public static readonly teamParticipantsPerPage: number = 10;
   public static readonly usersPerPage: number = 10;

   public static readonly defaultDebounceTime: number = 750;

   // endpoints show notifications after error response
   public static readonly newInterceptorPaths: string[] = [
      'v2/auth/logout',
      'v2/auth/user',
      'v2/championship/matches',
      'v2/championship/predictions',
      'v2/competitions',
      'v2/cup/matches',
      'v2/matches',
      'v2/team/matches',
      'v2/team/participants',
      'v2/team/teams',
      'v2/users'
   ];

   // new image logos paths
   public static readonly clubsLogosPath: string = environment.imageURL + '/clubs';
   public static readonly teamsLogosPath: string = environment.imageURL + '/teams';

   // max limit values (same limitations present on the back-end side)
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
      teamTeams: 34,

      clubs: 500,
      competitions: 100,
      guestbook: 20,
      matches: 100,
      news: 10,
      users: 10
   };

   public static readonly textMessages = {
      ngSelect: {
         notFoundText: 'Нічого не знайдено',
         typeToSearchText: 'Почніть вводити текст для пошуку',
         loadingText: 'Завантаження'
      }
   };

   public static readonly participantsInTeam: number = 4;
}
