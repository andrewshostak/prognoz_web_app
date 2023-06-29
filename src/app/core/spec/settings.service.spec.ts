import { SettingsService } from '@services/settings.service';

describe('SettingsService', () => {
   it('should have `clubsLogosPath` value', () => {
      expect(SettingsService.imageBaseUrl).toBeDefined();
   });
});
