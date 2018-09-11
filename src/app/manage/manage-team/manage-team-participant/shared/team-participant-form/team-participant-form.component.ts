import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { Team } from '@models/team/team.model';
import { TeamParticipant } from '@models/team/team-participant.model';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { TeamService } from '@services/team/team.service';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-participant-form',
    templateUrl: './team-participant-form.component.html',
    styleUrls: ['./team-participant-form.component.scss']
})
export class TeamParticipantFormComponent implements OnChanges, OnInit {
    constructor(
        private competitionService: CompetitionService,
        private location: Location,
        private notificationsService: NotificationsService,
        private router: Router,
        private teamService: TeamService,
        private teamParticipantService: TeamParticipantService,
        private userService: UserService
    ) {}

    @Input() teamParticipant: TeamParticipant;

    competitions: Competition[];
    errorCompetitions: string;
    errorTeams: string;
    errorUsers: string;
    teams: Team[];
    teamParticipantForm: FormGroup;
    users: User[];

    ngOnChanges(simpleChanges: SimpleChanges) {
        UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.teamParticipantForm, 'teamParticipant');
    }

    ngOnInit() {
        this.getCompetitionsData();
        this.getTeamsData();
        this.getUsersData();
        this.teamParticipantForm = new FormGroup({
            team_id: new FormControl('', [Validators.required]),
            user_id: new FormControl('', [Validators.required]),
            competition_id: new FormControl('', [Validators.required]),
            captain: new FormControl(false),
            confirmed: new FormControl(false),
            refused: new FormControl(false),
            ended: new FormControl(false)
        });
    }

    onSubmit(): void {
        if (this.teamParticipantForm.valid) {
            this.teamParticipant
                ? this.updateTeamParticipant(this.teamParticipantForm.value)
                : this.createTeamParticipant(this.teamParticipantForm.value);
        }
    }

    resetTeamParticipantForm(): void {
        this.teamParticipantForm.reset();
    }

    private getCompetitionsData(): void {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, true, true).subscribe(
            response => {
                this.competitions = response.competitions;
            },
            error => {
                this.errorCompetitions = error;
            }
        );
    }

    private getTeamsData(): void {
        this.teamService.getTeams().subscribe(
            response => {
                this.teams = response.teams;
            },
            error => {
                this.errorTeams = error;
            }
        );
    }

    private getUsersData(): void {
        this.userService.getUsers(null, 'name', 'asc').subscribe(
            response => {
                this.users = response.users;
            },
            error => {
                this.errorUsers = error;
            }
        );
    }

    private createTeamParticipant(teamParticipant: TeamParticipant): void {
        this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Заявку / Учасника створено');
                this.router.navigate(['/manage', 'team', 'participants', response.id, 'edit']);
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private updateTeamParticipant(teamParticipant: TeamParticipant): void {
        teamParticipant.id = this.teamParticipant.id;
        this.teamParticipantService.updateTeamParticipant(teamParticipant).subscribe(
            () => {
                this.notificationsService.success('Успішно', 'Заявку / Учасника змінено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
