import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChampionshipMatch } from '@models/championship/championship-match.model';
import { ChampionshipMatchService } from '@services/championship/championship-match.service';
import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-match-edit-active',
    templateUrl: './match-edit-active.component.html',
    styleUrls: ['./match-edit-active.component.scss']
})
export class MatchEditActiveComponent implements OnInit {
    constructor(
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private championshipMatchService: ChampionshipMatchService,
        private clubService: ClubService
    ) {}

    championshipMatchEditActiveForm: FormGroup;
    championshipMatches: ChampionshipMatch[];
    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorChampionshipMatches: string;
    errorClubs: string | Array<string>;
    selectedMatch: ChampionshipMatch;
    spinnerButton = false;

    ngOnInit() {
        this.championshipMatchEditActiveForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            t1_id: ['', [Validators.required]],
            t2_id: ['', [Validators.required]],
            starts_at: ['', [Validators.required]]
        });
        this.getChampionshipMatchesData();
        this.getClubsData();
    }

    onChange(id) {
        id = parseInt(id, 10);
        this.selectedMatch = this.championshipMatches.find(match => match.id === id);
        this.championshipMatchEditActiveForm.patchValue({
            id: this.selectedMatch.id,
            t1_id: this.selectedMatch.t1_id,
            t2_id: this.selectedMatch.t2_id,
            starts_at: this.selectedMatch.starts_at
        });
    }

    onSubmit() {
        if (this.selectedMatch.id) {
            this.spinnerButton = true;
            this.championshipMatchService.updateChampionshipMatch(this.championshipMatchEditActiveForm.value).subscribe(
                response => {
                    this.spinnerButton = false;
                    this.selectedMatch = response;

                    this.getChampionshipMatchesData();
                    this.notificationService.success('Успішно', 'Матч змінено');
                },
                error => {
                    this.spinnerButton = false;
                    this.notificationService.error('Помилка', error);
                }
            );
        }
    }

    swapClubs() {
        const t1_id = this.championshipMatchEditActiveForm.value.t1_id;
        const t2_id = this.championshipMatchEditActiveForm.value.t2_id;
        this.championshipMatchEditActiveForm.patchValue({ t1_id: t2_id, t2_id: t1_id });
    }

    resetForm() {
        this.championshipMatchEditActiveForm.reset();
    }

    private getClubsData() {
        this.clubService.getClubs().subscribe(
            response => {
                this.clubs = response.clubs;
            },
            error => {
                this.errorClubs = error;
            }
        );
    }

    private getChampionshipMatchesData() {
        const param = [{ parameter: 'filter', value: 'active' }];
        this.championshipMatchService.getChampionshipMatches(param).subscribe(
            response => {
                if (response) {
                    this.championshipMatches = response.championship_matches;
                }
            },
            error => {
                this.errorChampionshipMatches = error;
            }
        );
    }
}
