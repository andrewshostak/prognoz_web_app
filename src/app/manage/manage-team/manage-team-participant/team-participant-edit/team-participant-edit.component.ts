import { Component, OnInit } from '@angular/core';
import { TeamParticipant } from '@models/team/team-participant.model';
import { ActivatedRoute, Params } from '@angular/router';
import { TeamParticipantService } from '@services/team/team-participant.service';

@Component({
    selector: 'app-team-participant-edit',
    templateUrl: './team-participant-edit.component.html',
    styleUrls: ['./team-participant-edit.component.scss']
})
export class TeamParticipantEditComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute, private teamParticipantService: TeamParticipantService) {}

    teamParticipant: TeamParticipant;
    errorTeamParticipant: string;

    ngOnInit() {
        this.activatedRoute.params.forEach((params: Params) => {
            this.getTeamParticipant(params['id']);
        });
    }

    private getTeamParticipant(teamParticipantId: number): void {
        this.teamParticipantService.getTeamParticipant(teamParticipantId).subscribe(
            response => {
                this.teamParticipant = response;
            },
            error => {
                this.errorTeamParticipant = error;
            }
        );
    }
}
