import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { NotificationsService } from 'angular2-notifications';
import { TeamMatch } from '@models/team/team-match.model';
import { TeamMatchService } from '@services/team/team-match.service';

@Component({
    selector: 'app-team-match-create',
    templateUrl: './team-match-create.component.html',
    styleUrls: ['./team-match-create.component.scss']
})
export class TeamMatchCreateComponent implements OnInit {
    constructor(
        private clubService: ClubService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private teamMatchService: TeamMatchService
    ) {}

    addedMatches: Array<TeamMatch> = [];
    clubs: Club[];
    errorClubs: string;
    lastEnteredDate: string;
    spinnerButton = false;
    teamMatchCreateForm: FormGroup;

    ngOnInit() {
        this.teamMatchCreateForm = this.formBuilder.group({
            t1_id: ['', [Validators.required]],
            t2_id: ['', [Validators.required]],
            starts_at: ['', [Validators.required]]
        });
        this.clubService.getClubs().subscribe(
            response => {
                this.clubs = response.clubs;
            },
            error => {
                this.errorClubs = error;
            }
        );
    }

    onSubmit() {
        if (this.teamMatchCreateForm.valid) {
            this.spinnerButton = true;
            this.teamMatchService.createTeamMatch(this.teamMatchCreateForm.value).subscribe(
                response => {
                    this.lastEnteredDate = response.starts_at;
                    this.resetForm();
                    this.teamMatchCreateForm.patchValue({ starts_at: this.lastEnteredDate });
                    this.addedMatches.push(response);
                    this.notificationService.success('Успішно', 'Матч додано!');
                    this.spinnerButton = false;
                },
                errors => {
                    errors.forEach(error => this.notificationService.error('Помилка', error));
                    this.spinnerButton = false;
                }
            );
        }
    }

    resetForm() {
        this.teamMatchCreateForm.reset();
    }

    swapClubs() {
        const t1_id = this.teamMatchCreateForm.value.t1_id;
        const t2_id = this.teamMatchCreateForm.value.t2_id;
        this.teamMatchCreateForm.patchValue({ t1_id: t2_id, t2_id: t1_id });
    }
}
