import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../core/auth.service';
import { Club } from '../shared/models/club.model';
import { ClubService } from '../core/club.service';
import { CurrentStateService } from '../core/current-state.service';
import { environment } from '../../environments/environment';
import { ImageService } from '../core/image.service';
import { NotificationsService } from 'angular2-notifications';
import { TitleService } from '../core/title.service';
import { User } from '../shared/models/user.model';
import { UserService } from '../core/user.service';

@Component({
    selector: 'app-me',
    templateUrl: './me.component.html',
    styleUrls: ['./me.component.css']
})
export class MeComponent implements OnInit, OnDestroy {
    constructor(
        private authService: AuthService,
        private clubService: ClubService,
        private currentStateService: CurrentStateService,
        private imageService: ImageService,
        private notificationService: NotificationsService,
        private router: Router,
        private titleService: TitleService,
        private userService: UserService
    ) {
        imageService.uploadedImage$.subscribe(response => {
            this.userEditForm.patchValue({ image: response });
            this.errorImage = null;
        });
        imageService.uploadError$.subscribe(response => {
            this.errorImage = response;
        });
    }

    authenticatedUser: User = Object.assign({}, this.currentStateService.user);
    clubs: Club[];
    clubsImagesUrl: string = environment.apiImageClubs;
    errorClubs: string;
    errorImage: string;
    hasUnsavedChanges: boolean;
    spinnerButton: boolean;
    userEditForm: FormGroup;
    userImageDefault: string = environment.imageUserDefault;
    userImagesUrl: string = environment.apiImageUsers;
    userSubscription: Subscription;

    get clubUser(): FormArray {
        return <FormArray>this.userEditForm.controls.club_user;
    }

    addClub(): void {
        this.clubUser.push(
            new FormGroup({
                club_id: new FormControl(null, [Validators.required]),
                main: new FormControl(this.clubUser.length ? 0 : 1)
            })
        );
    }

    disableAddClubButton(): boolean {
        return this.clubUser.length >= 3;
    }

    fileChange(event) {
        this.hasUnsavedChanges = true;
        this.imageService.fileChange(event, environment.imageSettings.user);
    }

    findClub(clubId: number): Club {
        return this.clubs.find(club => {
            return club.id.toString() === clubId.toString();
        });
    }

    ngOnDestroy() {
        if (!this.userSubscription.closed) {
            this.userSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.getClubsData();
        this.userSubscription = this.authService.getUser.subscribe(response => {
            if (!response) {
                this.router.navigate(['/403']);
            }
            this.authenticatedUser = Object.assign({}, response);
        });
        this.resetData();
        this.titleService.setTitle('Редагувати профіль');
    }

    onCancel(): void {
        this.authenticatedUser = Object.assign({}, this.currentStateService.user);
        this.resetData();
    }

    onSubmit() {
        this.spinnerButton = true;
        this.userService.updateUser(this.userEditForm.value).subscribe(
            response => {
                this.authService.initializeUser();
                this.notificationService.success('Успішно', 'Ваш профіль змінено!');
                this.spinnerButton = false;
                this.hasUnsavedChanges = false;
            },
            errors => {
                errors.forEach(error => this.notificationService.error('Помилка', error));
                this.hasUnsavedChanges = false;
                this.spinnerButton = false;
            }
        );
    }

    onSelectMainClub(index: number): void {
        this.clubUser.controls.forEach((item, i) => {
            if (index !== i) {
                item.patchValue({ main: 0 });
            }
        });
    }

    removeClub(index: number): void {
        let setMain = false;
        if (this.clubUser.at(index).get('main').value === 1) {
            setMain = true;
        }
        this.clubUser.removeAt(index);
        if (setMain) {
            this.setMain(0);
        }
    }

    setMain(index: number = 0): void {
        if (this.clubUser.length) {
            this.clubUser.at(index).patchValue({ main: 1 });
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

    private resetData(): void {
        this.errorImage = null;
        this.userEditForm = new FormGroup(
            {
                id: new FormControl(this.authenticatedUser.id),
                first_name: new FormControl(this.authenticatedUser.first_name, [Validators.maxLength(50)]),
                hometown: new FormControl(this.authenticatedUser.hometown, [Validators.maxLength(50)]),
                image: new FormControl(''),
                club_user: new FormArray([])
            },
            this.validateClubUser
        );

        if (this.authenticatedUser.clubs) {
            this.authenticatedUser.clubs.forEach(club => {
                this.clubUser.push(
                    new FormGroup({
                        club_id: new FormControl(club.id.toString(), [Validators.required]),
                        main: new FormControl(club.pivot.main)
                    })
                );
            });
        }
    }

    private validateClubUser(formGroup: FormGroup) {
        const values = [];
        const clubUser = <FormArray>formGroup.controls.club_user;

        if (!clubUser.length) {
            return null;
        }

        for (const i in clubUser.controls) {
            if (clubUser.controls[i]) {
                const control = clubUser.at(parseInt(i, 10)).get('club_id');
                if (!control || !control.value) {
                    return null;
                }
                if (values.includes(control.value)) {
                    return { clubUserEqality: true };
                } else {
                    values.push(control.value);
                }
            }
        }

        return null;
    }
}
