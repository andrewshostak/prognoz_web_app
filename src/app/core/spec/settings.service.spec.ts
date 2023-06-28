import { environment } from '@env';
import { SettingsService } from '@services/settings.service';

describe('SettingsService', () => {
   it('should have `clubsLogosPath` value', () => {
      expect(SettingsService.clubsLogosPath).toEqual(environment.imageBaseUrl + '/clubs');
   });
});
