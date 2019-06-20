import { Injectable } from '@angular/core';

import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly allowToUpdateResultAfterDays: number = 3;
   public static readonly championshipMatchesPerPage: number = 10;
   public static readonly matchesPerPage: number = 12;
   public static readonly newInterceptorPaths: string[] = ['v2/championship/matches', 'v2/matches'];

   public static readonly clubsLogosPath: string = environment.imageURL + '/clubs';
}
