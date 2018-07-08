import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '@services/auth.service';
import { environment } from '@env';
import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { CurrentStateService } from '@services/current-state.service';
import { NotificationsService } from 'angular2-notifications';
import { Team } from '@models/team/team.model';
import { TeamService } from '@services/team/team.service';
import { TeamParticipant } from '@models/team/team-participant.model';
import { TeamParticipantService } from '@services/team/team-participant.service';
import { TitleService } from '@services/title.service';
import { User } from '@models/user.model';

declare var $: any;

@Component({
    selector: 'app-team-squads',
    templateUrl: './team-squads.component.html',
    styleUrls: ['./team-squads.component.css']
})
export class TeamSquadsComponent implements OnDestroy, OnInit {
    constructor(
        private authService: AuthService,
        private competitionService: CompetitionService,
        private currentStateService: CurrentStateService,
        private notificationsService: NotificationsService,
        private teamService: TeamService,
        private teamParticipantService: TeamParticipantService,
        private titleService: TitleService
    ) {}

    alreadyJoined = false;
    alreadyPending = false;
    authenticatedUser: User = this.currentStateService.user;
    clubsImagesUrl: string = environment.apiImageClubs;
    errorTeams: string;
    errorCompetition: string;
    confirmModalData: any;
    confirmModalId: string;
    confirmModalMessage: string;
    confirmSpinnerButton = false;
    competition: Competition;
    spinnerButton = false;
    spinnerButtonSelect = false;
    teamImageDefault: string = environment.imageTeamDefault;
    teamCreateForm: FormGroup;
    teamsImagesUrl: string = environment.apiImageTeams;
    teams: Team[];
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

    confirmModalSubmit(data: any) {
        switch (this.confirmModalId) {
            case 'joinTeamConfirmModal':
                this.createTeamParticipant(data);
                break;
            case 'confirmTeamParticipantConfirmModal':
                this.confirmParticipant(data);
                break;
            case 'refuseTeamParticipantConfirmModal':
                this.refuseParticipant(data);
                break;
        }
    }

    confirmParticipantModalOpen(teamParticipant: TeamParticipant) {
        this.confirmModalMessage = 'Ви справді хочете підтвердити заявку ' + teamParticipant.user.name + '?';
        this.confirmModalId = 'confirmTeamParticipantConfirmModal';
        this.confirmModalData = teamParticipant;
    }

    confirmParticipant(teamParticipant: TeamParticipant) {
        this.confirmSpinnerButton = true;
        const teamParticipantToChange = Object.assign({}, teamParticipant);
        teamParticipantToChange.confirmed = true;
        teamParticipantToChange.refused = false;
        this.teamParticipantService.updateTeamParticipant(teamParticipantToChange).subscribe(
            response => {
                this.getTeamsData();
                this.notificationsService.success('Успішно', 'Заявку в команду підтверджено');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                for (const error of errors) {
                    this.notificationsService.error('Помилка', error);
                }
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    createTeamCaptain(teamId: number) {
        this.spinnerButtonSelect = true;
        const teamParticipant = {
            team_id: teamId,
            user_id: this.authenticatedUser.id,
            captain: true,
            confirmed: true
        };
        this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(
            response => {
                this.getTeamsData();
                this.notificationsService.success('Успішно', 'Заявку в команду подано');
                this.spinnerButtonSelect = false;
            },
            errors => {
                for (const error of errors) {
                    this.notificationsService.error('Помилка', error);
                }
                this.spinnerButtonSelect = false;
            }
        );
    }

    createTeamParticipant(team: Team) {
        this.confirmSpinnerButton = true;
        const teamParticipant = {
            team_id: team.id,
            user_id: this.authenticatedUser.id,
            captain: false,
            confirmed: false
        };
        this.teamParticipantService.createTeamParticipant(teamParticipant).subscribe(
            response => {
                this.getTeamsData();
                this.notificationsService.success('Успішно', 'Заявку в команду подано');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                for (const error of errors) {
                    this.notificationsService.error('Помилка', error);
                }
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    getCompetitionData() {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, true).subscribe(
            response => {
                this.resetCompetitionData();
                if (response) {
                    this.competition = response.competition;
                    this.getTeamsData();
                }
            },
            error => {
                this.resetCompetitionData();
                this.errorCompetition = error;
            }
        );
    }

    getTeamsData() {
        const param = [{ parameter: 'competition_id', value: this.competition.id.toString() }];
        this.teamService.getTeams(param).subscribe(
            response => {
                this.resetTeamsData();
                if (response) {
                    this.isMemberOfTeam(response.teams);
                    this.teams = response.teams;
                }
            },
            error => {
                this.resetTeamsData();
                this.errorTeams = error;
            }
        );
    }

    isMemberOfTeam(teams: Team[]): void {
        if (this.authenticatedUser) {
            for (const team of teams) {
                if (
                    team.team_participants.filter(participant => participant.user_id === this.authenticatedUser.id && participant.confirmed)
                        .length >= 1
                ) {
                    this.alreadyJoined = true;
                }
                if (
                    team.team_participants.filter(
                        participant => participant.user_id === this.authenticatedUser.id && (!participant.confirmed && !participant.refused)
                    ).length >= 1
                ) {
                    this.alreadyPending = true;
                }
            }
        }
    }

    joinTeamModalOpen(team: Team) {
        this.confirmModalMessage = 'Ви справді хочете подати заявку в команду ' + team.name + '?';
        this.confirmModalId = 'joinTeamConfirmModal';
        this.confirmModalData = team;
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.titleService.setTitle('Заявки на участь / склади команд - Командний');
        this.userSubscription = this.authService.getUser.subscribe(response => {
            this.authenticatedUser = response;
            this.getCompetitionData();
        });
        this.getCompetitionData();
        this.teamCreateForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
            image: new FormControl(null, []),
            caption: new FormControl(null, [Validators.maxLength(140)]),
            club_id: new FormControl(null, [])
        });
    }

    numberOfConfirmedParticipants(participants: TeamParticipant[]): number {
        return participants.filter(participant => participant.confirmed).length;
    }

    onSubmitted(teamCreateForm: FormGroup) {
        if (teamCreateForm.valid) {
            this.spinnerButton = true;
            this.teamService.createTeam(teamCreateForm.value).subscribe(
                response => {
                    this.notificationsService.success('Успішно', 'Команду ' + response.name + ' створено');
                    $('#teamEditModal').modal('hide');
                    this.teamCreateForm.reset({ image: null });
                    this.createTeamCaptain(response.id);
                    this.spinnerButton = false;
                },
                errors => {
                    for (const error of errors) {
                        this.notificationsService.error('Помилка', error);
                    }
                    this.spinnerButton = false;
                }
            );
        }
    }

    onSubmittedSelect(teamSelectForm: FormGroup) {
        this.createTeamCaptain(teamSelectForm.value.team_id);
        teamSelectForm.reset();
        $('#teamSelectModal').modal('hide');
    }

    refuseParticipant(teamParticipant: TeamParticipant) {
        this.confirmSpinnerButton = true;
        const teamParticipantToChange = Object.assign({}, teamParticipant);
        teamParticipantToChange.confirmed = false;
        teamParticipantToChange.refused = true;
        this.teamParticipantService.updateTeamParticipant(teamParticipantToChange).subscribe(
            response => {
                this.getTeamsData();
                this.notificationsService.success('Успішно', 'Заявку в команду скасовано');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                for (const error of errors) {
                    this.notificationsService.error('Помилка', error);
                }
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    refuseParticipantModalOpen(teamParticipant: TeamParticipant) {
        this.confirmModalMessage = 'Ви справді хочете скасувати заявку ' + teamParticipant.user.name + '?';
        this.confirmModalId = 'refuseTeamParticipantConfirmModal';
        this.confirmModalData = teamParticipant;
    }

    showJoinButton(team: Team): boolean {
        if (!this.authenticatedUser) {
            return false;
        }
        if (this.authenticatedUser) {
            // current number of participants greater than 4
            if (team.team_participants.filter(participant => participant.confirmed).length >= 4) {
                return false;
            }
            // current user already joined
            if (team.team_participants.filter(participant => participant.user_id === this.authenticatedUser.id).length >= 1) {
                return false;
            }
            // current user application already cancelled
            if (
                team.team_participants.filter(participant => participant.user_id === this.authenticatedUser.id && participant.refused)
                    .length >= 1
            ) {
                return false;
            }
        }

        return true;
    }

    private resetTeamsData() {
        this.teams = null;
        this.errorTeams = null;
        this.alreadyJoined = false;
    }

    private resetCompetitionData() {
        this.competition = null;
        this.errorCompetition = null;
    }
}
