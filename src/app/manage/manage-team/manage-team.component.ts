import { Component, OnInit } from '@angular/core';

import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';

declare var $: any;

@Component({
    selector: 'app-manage-team',
    templateUrl: './manage-team.component.html',
    styleUrls: ['./manage-team.component.scss']
})
export class ManageTeamComponent implements OnInit {
    errorCompetitions: string;
    competitions: Competition[];
    confirmModalData: any;
    confirmModalId: string;
    confirmModalMessage: string;
    confirmSpinnerButton = false;

    constructor(private competitionService: CompetitionService, private notificationsService: NotificationsService) {}

    confirmModalSubmit(data: any) {
        switch (this.confirmModalId) {
            case 'startDrawConfirmModal':
                this.startDraw(data);
                break;
            case 'startNextRoundConfirmModal':
                this.startNextRound(data);
                break;
        }
    }

    nextRoundNumber(competition: Competition): number {
        if (competition) {
            if (!competition.active_round) {
                return 1;
            } else if (competition.active_round === competition.number_of_teams * 2 - 2) {
                return null;
            } else {
                return competition.active_round + 1;
            }
        }

        return null;
    }

    ngOnInit() {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, true, true).subscribe(
            response => {
                if (response) {
                    this.competitions = response.competitions;
                }
            },
            error => {
                this.errorCompetitions = error;
            }
        );
    }

    startDraw(competition: Competition) {
        this.confirmSpinnerButton = true;
        const competitionToUpdate = Object.assign({}, competition);
        competitionToUpdate.stated = false;
        competitionToUpdate.active = true;
        this.competitionService.updateCompetition(competitionToUpdate, competitionToUpdate.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Жеребкування календаря проведено');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    startDrawConfirmModalOpen(competition: Competition): void {
        this.confirmModalMessage = 'Ви справді хочете провести жеребкування календаря?';
        this.confirmModalId = 'startDrawConfirmModal';
        this.confirmModalData = competition;
    }

    startNextRound(competition: Competition) {
        this.confirmSpinnerButton = true;
        const competitionToUpdate = Object.assign({}, competition);
        competitionToUpdate.active_round = this.nextRoundNumber(competition);
        this.competitionService.updateCompetition(competitionToUpdate, competitionToUpdate.id).subscribe(
            response => {
                this.notificationsService.success('Успішно', 'Наступний раунд розпочато');
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
                this.confirmSpinnerButton = false;
                $('#' + this.confirmModalId).modal('hide');
            }
        );
    }

    startNextRoundConfirmModalOpen(competition: Competition): void {
        this.confirmModalMessage = 'Ви справді хочете розпочати наступний раунд?';
        this.confirmModalId = 'startNextRoundConfirmModal';
        this.confirmModalData = competition;
    }
}
