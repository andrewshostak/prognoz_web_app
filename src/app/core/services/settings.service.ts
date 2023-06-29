import { Injectable } from '@angular/core';

import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;

   public static readonly defaultDebounceTime: number = 750;

   public static readonly userDefaultImage: string = 'default.png';
   public static readonly imageBaseUrl = {
      awards: environment.imageBaseUrl + '/awards',
      clubs: environment.imageBaseUrl + '/clubs',
      news: environment.imageBaseUrl + '/news',
      teams: environment.imageBaseUrl + '/teams',
      users: environment.imageBaseUrl + '/users'
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
