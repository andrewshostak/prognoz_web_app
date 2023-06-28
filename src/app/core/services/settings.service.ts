import { Injectable } from '@angular/core';

import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;

   public static readonly defaultDebounceTime: number = 750;

   // new image logos paths
   public static readonly awardsLogosPath: string = environment.imageBaseUrl + '/awards';
   public static readonly clubsLogosPath: string = environment.imageBaseUrl + '/clubs';
   public static readonly newsLogosPath: string = environment.imageBaseUrl + '/news';
   public static readonly teamsLogosPath: string = environment.imageBaseUrl + '/teams';
   public static readonly usersLogosPath: string = environment.imageBaseUrl + '/users';
   public static readonly userDefaultImage: string = 'default.png';

   public static readonly textMessages = {
      ngSelect: {
         notFoundText: 'Нічого не знайдено',
         typeToSearchText: 'Почніть вводити текст для пошуку',
         loadingText: 'Завантаження'
      }
   };

   public static readonly participantsInTeam: number = 4;
}
