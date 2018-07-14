import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Club } from '@models/club.model';
import { ClubService } from '@services/club.service';
import { environment } from '@env';
import { ImageService } from '@services/image.service';
import { NotificationsService } from 'angular2-notifications';
import { Team } from '@models/team/team.model';

declare var $: any;

@Component({
    selector: 'app-team-edit-modal',
    templateUrl: './team-edit-modal.component.html',
    styleUrls: ['./team-edit-modal.component.scss']
})
export class TeamEditModalComponent implements OnInit {
    @Input() hasUnsavedChanges = false;
    @Input() team: Team = null;
    @Input() spinnerButton: boolean;
    @Input() teamForm: FormGroup;
    @Output() submitted = new EventEmitter<FormGroup>();

    constructor(private clubService: ClubService, private imageService: ImageService, private notificationsService: NotificationsService) {
        imageService.uploadedImage$.subscribe(response => {
            this.teamForm.patchValue({ image: response });
            this.errorImage = null;
        });
        imageService.uploadError$.subscribe(response => {
            this.errorImage = response;
        });
    }

    clubs: Club[];
    errorClubs: string;
    errorImage: string;
    options = {
        position: ['left', 'bottom'],
        timeOut: 5000,
        showProgressBar: false,
        maxLength: 0,
        animate: 'scale'
    };
    teamImageDefault: string = environment.imageTeamDefault;
    teamImagesUrl: string = environment.apiImageTeams;

    fileChange(event) {
        this.hasUnsavedChanges = true;
        this.imageService.fileChange(event, environment.imageSettings.team);
    }

    ngOnInit() {
        this.getClubsData();
        $('#teamEditModal').on('hidden.bs.modal', e => {
            this.resetTeamForm();
        });
    }

    onSubmit() {
        this.submitted.emit(this.teamForm);
    }

    resetTeamForm() {
        if (!this.team) {
            this.teamForm.reset();
        } else {
            this.teamForm.patchValue({
                name: this.team.name,
                caption: this.team.caption,
                club_id: this.team.club_id,
                image: null
            });
        }
    }

    private getClubsData() {
        this.clubService.getClubs(null, 'clubs').subscribe(
            response => {
                if (response) {
                    this.clubs = response.clubs;
                }
            },
            error => {
                this.errorClubs = error;
            }
        );
    }
}
