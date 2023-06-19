import { Component, OnInit } from '@angular/core';

import { Sequence } from '@enums/sequence.enum';
import { User } from '@models/v2/user.model';
import { UserSearch } from '@models/search/user-search.model';
import { UserService } from '@services/v2/user.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-last-user',
   templateUrl: './last-user.component.html',
   styleUrls: ['./last-user.component.scss']
})
export class LastUserComponent implements OnInit {
   public lastUser: User;
   public userDefaultImage = SettingsService.userDefaultImage;
   public usersLogosPath = SettingsService.usersLogosPath + '/';
   public homeCityInBrackets: string;

   constructor(private userService: UserService) {}

   public ngOnInit(): void {
      const search: UserSearch = { limit: 1, sequence: Sequence.Descending, orderBy: 'created_at' };
      this.userService.getUsers(search).subscribe(response => {
         this.lastUser = response.data[0];
         this.homeCityInBrackets = UtilsService.getHomeCityInBrackets(this.lastUser.hometown);
      });
   }
}
