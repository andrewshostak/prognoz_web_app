import { Injectable } from '@angular/core';

@Injectable()
export class SettingsService {
   public static readonly matchesPerPage: number = 12;
   public static readonly newInterceptorPaths: string[] = ['matches'];
}
