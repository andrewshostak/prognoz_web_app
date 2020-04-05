import { Component, OnInit } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { UserNew } from '@models/new/user-new.model';
import { UserSearch } from '@models/search/user-search.model';
import { UserNewService } from '@services/new/user-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-last-user',
   templateUrl: './last-user.component.html',
   styleUrls: ['./last-user.component.scss']
})
export class LastUserComponent implements OnInit {
   public lastUser: UserNew;
   public userDefaultImage = SettingsService.userDefaultImage;
   public usersLogosPath = SettingsService.usersLogosPath + '/';
   public homeCityInBrackets: string;

   constructor(private userService: UserNewService) {}

   public ngOnInit(): void {
      const search: UserSearch = { limit: 1, sequence: Sequence.Descending, orderBy: 'created_at' };
      this.userService.getUsers(search).subscribe(response => {
         this.lastUser = response.data[0];
         this.homeCityInBrackets = UtilsService.getHomeCityInBrackets(this.lastUser.hometown);
      });
   }
}
