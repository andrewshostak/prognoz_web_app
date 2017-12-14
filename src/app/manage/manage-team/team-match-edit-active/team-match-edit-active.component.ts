import { Component, OnInit }                    from '@angular/core';
import { FormBuilder, FormGroup, Validators }   from '@angular/forms';

import { Club }                                 from '../../../shared/models/club.model';
import { ClubService }                          from '../../../core/club.service';
import { environment }                          from '../../../../environments/environment';
import { TeamMatch }                            from '../../../shared/models/team-match.model';
import { TeamMatchService }                     from '../../../team/shared/team-match.service';
import { NotificationsService }                 from 'angular2-notifications';

@Component({
    selector: 'app-team-match-edit-active',
    templateUrl: './team-match-edit-active.component.html',
    styleUrls: ['./team-match-edit-active.component.css']
})
export class TeamMatchEditActiveComponent implements OnInit {

    constructor(
        private clubService: ClubService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationsService,
        private teamMatchService: TeamMatchService,
    ) { }

    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorClubs: string;
    errorTeamMatches: string;
    selectedMatch: TeamMatch;
    spinnerButton: boolean = false;
    teamMatchEditActiveForm: FormGroup;
    teamMatches: TeamMatch[];

    ngOnInit() {
        this.teamMatchEditActiveForm = this.formBuilder.group({
            id: ['', [Validators.required]],
            t1_id: ['', [Validators.required]],
            t2_id: ['', [Validators.required]],
            starts_at: ['', [Validators.required]]
        });
        this.getTeamMatchesData();
        this.getClubsData();
    }

    onChange(id) {
        this.selectedMatch = this.teamMatches.find(myObj => myObj.id == id);
        this.teamMatchEditActiveForm.patchValue({
            id: this.selectedMatch.id,
            t1_id: this.selectedMatch.t1_id,
            t2_id: this.selectedMatch.t2_id,
            starts_at: this.selectedMatch.starts_at
        });
    }

    onSubmit() {
        if (this.teamMatchEditActiveForm.valid && this.selectedMatch) {
            this.spinnerButton = true;
            this.teamMatchService.updateTeamMatch(this.teamMatchEditActiveForm.value)
                .subscribe(
                    response => {
                        this.selectedMatch = response;
                        this.getTeamMatchesData();
                        this.notificationService.success('Успішно', 'Матч змінено');
                        this.spinnerButton = false;
                    },
                    errors => {
                        errors.forEach(error => this.notificationService.error('Помилка', error));
                        this.spinnerButton = false;
                    }
                );
        }
    }

    swapClubs() {
        let t1_id = this.teamMatchEditActiveForm.value.t1_id;
        let t2_id = this.teamMatchEditActiveForm.value.t2_id;
        this.teamMatchEditActiveForm.patchValue({t1_id: t2_id, t2_id: t1_id});
    }

    resetForm() {
        this.teamMatchEditActiveForm.reset();
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

    private getTeamMatchesData() {
        let param = [{parameter: 'filter', value: 'active'}];
        this.teamMatchService.getTeamMatches(param).subscribe(
            response => {
                if (response) {
                    this.teamMatches = response.team_matches;
                }
            },
            error => {
                this.errorTeamMatches = error;
            }
        );
    }
}
