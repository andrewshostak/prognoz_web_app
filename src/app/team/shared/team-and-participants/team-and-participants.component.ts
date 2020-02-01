import { Component, Input } from '@angular/core';

import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamNew } from '@models/new/team-new.model';
import { TeamParticipantNew } from '@models/new/team-participant-new.model';
import { TeamParticipantSearch } from '@models/search/team-participant-search.model';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';
import { SettingsService } from '@services/settings.service';

@Component({
   selector: 'app-team-and-participants',
   templateUrl: './team-and-participants.component.html',
   styleUrls: ['./team-and-participants.component.scss']
})
export class TeamAndParticipantsComponent {
   @Input() public team: TeamNew;
   @Input() public competition: CompetitionNew;

   public isExpanded: boolean;
   public teamParticipants: TeamParticipantNew[];

   constructor(private teamParticipantService: TeamParticipantNewService) {}

   public toggleParticipants(): void {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
         this.getTeamParticipants(this.competition.id, this.team.id);
      }
   }

   private getTeamParticipants(competitionId: number, teamId: number): void {
      const search: TeamParticipantSearch = { competitionId, teamId, limit: SettingsService.maxLimitValues.teamParticipants, page: 1 };
      this.teamParticipantService.getTeamParticipants(search).subscribe(response => {
         this.teamParticipants = response.data;
      });
   }

   // todo: створення і заявлення існуючої команди
   //    + "Створити нову команду"
   //    "Заявити команду"
   //      нове модальене вікно

   // todo: buttons
   //  "Подати заявку в команду"
   //  "Підтвердити"
   //  "Відхилити"
   //  "Видалити" - delete team-participant endpoint
}
