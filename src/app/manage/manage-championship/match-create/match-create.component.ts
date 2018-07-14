import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-match-create',
    templateUrl: './match-create.component.html',
    styleUrls: ['./match-create.component.scss']
})
export class MatchCreateComponent implements OnInit {
    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private clubService: ClubService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService
    ) {}

    addedMatches: Array<ChampionshipMatch> = [];
    championshipMatchCreateForm: FormGroup;
    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    error: string | Array<string>;
    errorClubs: string | Array<string>;
    lastEnteredDate: string;
    spinnerButton = false;

    ngOnInit() {
        this.championshipMatchCreateForm = this.formBuilder.group({
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
        this.spinnerButton = true;
        this.championshipMatchService.createChampionshipMatch(this.championshipMatchCreateForm.value).subscribe(
            response => {
                this.lastEnteredDate = response.starts_at;
                this.resetForm();
                this.championshipMatchCreateForm.patchValue({ starts_at: this.lastEnteredDate });
                this.addedMatches.push(response);
                this.notificationService.success('Успішно', 'Матч додано!');
                this.spinnerButton = false;
            },
            errors => {
                for (const error of errors) {
                    this.notificationService.error('Помилка', error);
                }
                this.spinnerButton = false;
            }
        );
    }

    resetForm() {
        this.championshipMatchCreateForm.reset();
    }

    swapClubs() {
        const t1_id = this.championshipMatchCreateForm.value.t1_id;
        const t2_id = this.championshipMatchCreateForm.value.t2_id;
        this.championshipMatchCreateForm.patchValue({ t1_id: t2_id, t2_id: t1_id });
    }
}
