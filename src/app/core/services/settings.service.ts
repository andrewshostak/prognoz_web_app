import { Injectable } from '@angular/core';

import { CupApplicationPlace } from '@enums/cup-application-place.enum';
import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;

   // pagination
   public static readonly championshipMatchesPerPage: number = 10;
   public static readonly competitionsPerPage: number = 10;
   public static readonly clubsPerPage: number = 10;
   public static readonly cupMatchesPerPage: number = 16;
   public static readonly cupCupMatchesPerPage: number = 10;
   public static readonly cupStagesPerPage: number = 10;
   public static readonly guestbookMessagesPerPage: number = 15;
   public static readonly matchesPerPage: number = 12;
   public static readonly newsPerPage: number = 10;
   public static readonly teamMatchesPerPage: number = 12;
   public static readonly teamTeamMatchesPerPage: number = 10;
   public static readonly teamsPerPage: number = 10;
   public static readonly teamParticipantsPerPage: number = 10;
   public static readonly teamsStagesPerPage: number = 10;
   public static readonly usersPerPage: number = 10;

   public static readonly defaultDebounceTime: number = 750;

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
      cupApplications: 300,

      teamMatches: 20,
      teamParticipants: 10,
      teamPredictions: 24,
      teamStages: 40,
      teamTeamMatches: 16,
      teamTeams: 50,
      teamRatingItems: 32,
      teamRatingUsers: 200,

      clubs: 10,
      competitions: 100,
      guestbook: 20,
      comments: 40,
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
