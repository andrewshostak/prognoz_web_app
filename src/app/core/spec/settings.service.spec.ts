import { SettingsService } from '@services/settings.service';

describe('SettingsService', () => {
   it('should have matchesPerPage value', () => {
      expect(SettingsService.matchesPerPage).toEqual(12);
   });
});
