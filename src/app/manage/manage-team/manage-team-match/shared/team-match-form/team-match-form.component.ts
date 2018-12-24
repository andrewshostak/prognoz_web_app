import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { Competition } from '@models/competition.model';
import { CompetitionService } from '@services/competition.service';
import { environment } from '@env';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';
import { UtilsService } from '@services/utils.service';

@Component({
    selector: 'app-team-match-form',
    templateUrl: './team-match-form.component.html',
    styleUrls: ['./team-match-form.component.scss']
})
export class TeamMatchFormComponent implements OnChanges, OnInit {
    constructor(
        private clubService: ClubService,
        private competitionService: CompetitionService,
        private location: Location,
        private ngbModalService: NgbModal,
        private notificationsService: NotificationsService,
        private teamMatchService: TeamMatchService
    ) {}

    @Input() teamMatch: TeamMatch;

    clubs: Club[];
    competitions: Competition[];
    confirmModalMessage: string;
    confirmModalSubmit: (event) => void;
    errorClubs: string;
    errorCompetitions: string;
    openedModalReference: NgbModalRef;
    teamMatchForm: FormGroup;

    get competitionsFormArray(): FormArray {
        return <FormArray>this.teamMatchForm.get('competitions');
    }

    addCompetition(pivot?: { competition_id: number; round: number; number_in_round: number; number_in_competition: number }): void {
        this.competitionsFormArray.push(
            new FormGroup({
                competition_id: new FormControl(pivot ? pivot.competition_id : null, [Validators.required]),
                round: new FormControl({ value: pivot ? pivot.round : null, disabled: !this.teamMatch }, [
                    Validators.required,
                    Validators.min(1)
                ]),
                number_in_round: new FormControl({ value: pivot ? pivot.number_in_round : null, disabled: !this.teamMatch }, [
                    Validators.required,
                    Validators.min(1)
                ]),
                number_in_competition: new FormControl({ value: pivot ? pivot.number_in_competition : null, disabled: !this.teamMatch }, [
                    Validators.required,
                    Validators.min(1)
                ])
            })
        );
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        UtilsService.patchSimpleChangeValuesInForm(simpleChanges, this.teamMatchForm, 'teamMatch', (formGroup, field, value) => {
            if (field === 'competitions') {
                this.clearCompetitionsFormArray();
                if (value.length) {
                    value.forEach(competition => {
                        if (!this.competitions) {
                            this.competitions = [];
                        }
                        if (!this.competitions.find(item => item.id === competition.id)) {
                            this.competitions.push(competition);
                        }
                        this.addCompetition(competition.pivot);
                    });
                }
            } else {
                if (formGroup.get(field)) {
                    formGroup.patchValue({ [field]: value });
                }
            }
        });
    }

    ngOnInit() {
        this.getClubsData();
        this.getCompetitionsData();
        this.teamMatchForm = new FormGroup({
            t1_id: new FormControl('', [Validators.required]),
            t2_id: new FormControl('', [Validators.required]),
            starts_at: new FormControl('', [Validators.required]),
            home: new FormControl('', [Validators.maxLength(1), Validators.min(0), Validators.max(9)]),
            away: new FormControl('', [Validators.maxLength(1), Validators.min(0), Validators.max(9)]),
            active: new FormControl({ value: false, disabled: true }),
            ended: new FormControl({ value: false, disabled: true }),
            competitions: new FormArray([])
        });
    }

    onSubmit(): void {
        if (this.teamMatchForm.valid) {
            this.teamMatch ? this.updateTeamMatch(this.teamMatchForm.value) : this.createTeamMatch(this.teamMatchForm.value);
        }
    }

    openConfirmModal(content: NgbModalRef): void {
        this.confirmModalMessage = 'Очистити форму від змін?';
        this.confirmModalSubmit = () => this.resetTeamMatchForm();
        this.openedModalReference = this.ngbModalService.open(content);
    }

    removeCompetition(index: number): void {
        this.competitionsFormArray.removeAt(index);
    }

    resetTeamMatchForm(): void {
        this.clearCompetitionsFormArray();
        this.teamMatchForm.reset();
        if (this.teamMatch) {
            this.teamMatch.competitions.forEach(competition => this.addCompetition(competition.pivot));
            Object.entries(this.teamMatch).forEach(
                ([field, value]) => this.teamMatchForm.get(field) && this.teamMatchForm.patchValue({ [field]: value })
            );
        }
        this.openedModalReference.close();
    }

    private clearCompetitionsFormArray(): void {
        UtilsService.clearFormArray(this.competitionsFormArray);
    }

    private createTeamMatch(teamMatch: TeamMatch): void {
        this.teamMatchService.createTeamMatch(teamMatch).subscribe(
            () => {
                this.notificationsService.success('Успішно', 'Командний матч створено');
                this.teamMatchForm.get('t1_id').reset();
                this.teamMatchForm.get('t2_id').reset();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    private getClubsData(): void {
        this.clubService.getClubs().subscribe(
            response => {
                this.clubs = response.clubs;
            },
            error => {
                this.errorClubs = error;
            }
        );
    }

    private getCompetitionsData(): void {
        this.competitionService.getCompetitions(null, environment.tournaments.team.id, null, null, null, true).subscribe(
            response => {
                if (response && response.competitions) {
                    this.competitions = response.competitions;
                }
            },
            error => {
                this.errorCompetitions = error;
            }
        );
    }

    private updateTeamMatch(teamMatch: TeamMatch): void {
        teamMatch.id = this.teamMatch.id;
        this.teamMatchService.updateTeamMatch(teamMatch).subscribe(
            () => {
                this.notificationsService.success('Успішно', 'Кубковий матч змінено');
                this.location.back();
            },
            errors => {
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
