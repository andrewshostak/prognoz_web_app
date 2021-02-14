import { Injectable } from '@angular/core';

import { CupApplicationPlace } from '@enums/cup-application-place.enum';
import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;

   // pagination
   public static readonly championshipMatchesPerPage: number = 10;
   public static readonly cupMatchesPerPage: number = 16;
   public static readonly cupStagesPerPage: number = 10;
   public static readonly guestbookMessagesPerPage: number = 15;
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
      'v2/cup/predictions/my',
      'v2/matches',
      'v2/team/matches',
      'v2/team/participants',
      'v2/team/teams',
      'v2/users',
      'v2/guestbook-messages',
      'v2/comments'
   ];

   // new image logos paths
   public static readonly awardsLogosPath: string = environment.imageURL + '/awards';
   public static readonly clubsLogosPath: string = environment.imageURL + '/clubs';
   public static readonly newsLogosPath: string = environment.imageURL + '/news';
   public static readonly teamsLogosPath: string = environment.imageURL + '/teams';
   public static readonly usersLogosPath: string = environment.imageURL + '/users';
   public static readonly userDefaultImage: string = 'default.png';

   // max limit values (same limitations present on the back-end side)
   public static readonly maxLimitValues = {
      championshipMatches: 100,
      championshipPredictions: 150,
      championshipRating: 200,

      cupCupMatches: 48,
      cupMatches: 50,
      cupStages: 40,

      teamMatches: 20,
      teamParticipants: 10,
      teamPredictions: 10,
      teamTeamMatches: 10,
      teamTeams: 50,

      clubs: 500,
      competitions: 100,
      guestbook: 20,
      comments: 20,
      matches: 100,
      news: 10,
      seasons: 100,
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

   public static readonly cupApplicationPlaces: { id: CupApplicationPlace; title: string }[] = [
      { id: CupApplicationPlace.Home, title: 'Вдома' },
      { id: CupApplicationPlace.Away, title: 'На виїзді' },
      { id: CupApplicationPlace.Anywhere, title: 'Будь-де' }
   ];
}
