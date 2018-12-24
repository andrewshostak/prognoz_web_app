import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '@services/auth.service';
import { Competition } from '@models/competition.model';
import { CupApplicationService } from '@services/cup/cup-application.service';
import { environment } from '@env';
import { NotificationsService } from 'angular2-notifications';
import { User } from '@models/user.model';
import { UserService } from '@services/user.service';

@Component({
    selector: 'app-cup-add-application-modal',
    templateUrl: './cup-add-application-modal.component.html',
    styleUrls: ['./cup-add-application-modal.component.scss']
})
export class CupAddApplicationModalComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private cupApplicationService: CupApplicationService,
        private elementRef: ElementRef,
        private notificationsService: NotificationsService,
        private userService: UserService
    ) {}

    @Input() close: () => void;
    @Input() competition: Competition;
    @Input()
    cupApplication: {
        competition_id: number;
        applicant_id: number;
        receiver_id?: number;
        place?: number;
        id?: number;
    };
    @Output() successfulSubmitted = new EventEmitter<void>();

    cupAddApplicationForm: FormGroup;
    errorUsers: string;
    places: { id: number; title: string; slug: string }[];
    spinnerButton: boolean;
    users: User[];

    createCupApplication(): void {
        this.cupApplicationService.createCupApplication(this.cupAddApplicationForm.getRawValue()).subscribe(
            () => {
                this.notificationsService.success('Успішно', 'Заявку подано');
                this.successfulSubmitted.emit();
                this.spinnerButton = false;
            },
            errors => {
                this.spinnerButton = false;
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    hasModeratorRights(): boolean {
        return this.authService.hasRole('admin') || this.authService.hasRole('cup_editor');
    }

    isFriendlyCompetition(): boolean {
        if (this.competition) {
            return !this.competition.participants;
        }
        return false;
    }

    ngOnInit() {
        this.places = environment.tournaments.cup.places;
        this.userService.getUsers(null, 'name', 'asc').subscribe(
            response => {
                this.users = response.users;
            },
            error => {
                this.errorUsers = error;
            }
        );
        this.cupAddApplicationForm = new FormGroup({
            competition_id: new FormControl(this.cupApplication.competition_id, [Validators.required]),
            applicant_id: new FormControl({ value: this.cupApplication.applicant_id, disabled: !this.hasModeratorRights() }, [
                Validators.required
            ]),
            receiver_id: new FormControl(this.cupApplication.receiver_id),
            place: new FormControl(this.cupApplication.place)
        });
    }

    onSubmit(): void {
        if (this.cupAddApplicationForm.valid) {
            this.spinnerButton = true;
            this.cupApplication.id ? this.updateCupApplication() : this.createCupApplication();
        }
    }

    updateCupApplication(): void {
        this.cupApplicationService.updateCupApplication(this.cupAddApplicationForm.getRawValue(), this.cupApplication.id).subscribe(
            () => {
                this.notificationsService.success('Успішно', 'Заявку змінено');
                this.successfulSubmitted.emit();
                this.spinnerButton = false;
            },
            errors => {
                this.spinnerButton = false;
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }
}
