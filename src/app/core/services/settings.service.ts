import { Injectable } from '@angular/core';

import { environment } from '@env';

@Injectable()
export class SettingsService {
   public static readonly matchesPerPage: number = 12;
   public static readonly newInterceptorPaths: string[] = ['matches'];

   public static readonly clubsLogosPath: string = environment.imageURL + '/clubs';
}
