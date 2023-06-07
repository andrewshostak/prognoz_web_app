import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TeamParticipant } from '@models/v2/team/team-participant.model';
import { TeamParticipantNewService } from '@services/new/team-participant-new.service';

@Component({
   selector: 'app-team-participant-edit',
   templateUrl: './team-participant-edit.component.html',
   styleUrls: ['./team-participant-edit.component.scss']
})
export class TeamParticipantEditComponent implements OnInit {
   public teamParticipant: TeamParticipant;

   constructor(private activatedRoute: ActivatedRoute, private teamParticipantService: TeamParticipantNewService) {}

   public ngOnInit(): void {
      this.getTeamParticipant(this.activatedRoute.snapshot.params.id);
   }

   private getTeamParticipant(teamParticipantId: number): void {
      this.teamParticipantService.getTeamParticipant(teamParticipantId).subscribe(response => (this.teamParticipant = response));
   }
}
