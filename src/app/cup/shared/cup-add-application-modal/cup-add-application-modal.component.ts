import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl, Validators }   from '@angular/forms';

import { Competition }                          from '../../../shared/models/competition.model';
import { CupApplicationService }                from '../../cup-applications/cup-application.service';
import { environment }                          from '../../../../environments/environment';
import { HelperService }                        from '../../../core/helper.service';
import { NotificationsService }                 from 'angular2-notifications';
import { User }                                 from '../../../shared/models/user.model';
import { UserService }                          from '../../../core/user.service';

declare const $: any;

@Component({
  selector: 'app-cup-add-application-modal',
  templateUrl: './cup-add-application-modal.component.html',
  styleUrls: ['./cup-add-application-modal.component.css']
})
export class CupAddApplicationModalComponent implements AfterViewInit, OnInit, OnChanges {

    constructor(
        private cupApplicationService: CupApplicationService,
        private elementRef: ElementRef,
        private helperService: HelperService,
        private notificationsService: NotificationsService,
        private userService: UserService
    ) { }

    @Input() competition: Competition;
    @Input() cupApplication: {
        competition_id: number,
        applicant_id: number,
        receiver_id?: number,
        place?: number,
        id?: number
    };
    @Output() successfulSubmit = new EventEmitter<void>();

    cupAddApplicationForm: FormGroup;
    errorUsers: string;
    places: {id: number, title: string, slug: string}[];
    spinnerButton: boolean;
    users: User[];

    createCupApplication(): void {
        this.cupApplicationService.createCupApplication(this.cupAddApplicationForm.getRawValue()).subscribe(
            response => {
                $(this.elementRef.nativeElement.querySelector('#cupAddApplicationModal')).modal('hide');
                this.notificationsService.success('Успішно', 'Заявку подано');
                this.successfulSubmit.emit();
                this.spinnerButton = false;
            },
            errors => {
                this.spinnerButton = false;
                errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
        );
    }

    hasModeratorRights(): boolean {
        return this.helperService.hasRole('admin') || this.helperService.hasRole('cup_editor');
    }

    isFriendlyCompetition(): boolean {
        if (this.competition) {
            return !this.competition.participants;
        }
        return false;
    }

    ngAfterViewInit() {
        $(this.elementRef.nativeElement.querySelector('#cupAddApplicationModal')).on('hide.bs.modal', () => {
            this.cupAddApplicationForm.reset();
        });
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
            competition_id: new FormControl('', [Validators.required]),
            applicant_id: new FormControl({value: '', disabled: !this.hasModeratorRights()}, [Validators.required]),
            receiver_id: new FormControl(null),
            place: new FormControl('')
        });
    }

    ngOnChanges(simpleChanges: SimpleChanges) {
        Object.entries(simpleChanges)
            .filter(([propName, change]) => propName === 'cupApplication' && !change.firstChange)
            .forEach(([propName, valueChange]) => {
                if (valueChange.currentValue) {
                    Object.entries(valueChange.currentValue).forEach(
                        ([field, value]) =>
                            this.cupAddApplicationForm.get(field) &&
                            this.cupAddApplicationForm.patchValue({ [field]: value })
                    );
                } else {
                    this.cupAddApplicationForm.reset();
                }
            });
    }

    onSubmit(): void {
        if (this.cupAddApplicationForm.valid) {
            this.spinnerButton = true;
            this.cupApplication.id ?
                this.updateCupApplication() :
                this.createCupApplication();
        }
    }

    updateCupApplication(): void {
        this.cupApplicationService
            .updateCupApplication(this.cupAddApplicationForm.getRawValue(), this.cupApplication.id)
            .subscribe(
                response => {
                    $(this.elementRef.nativeElement.querySelector('#cupAddApplicationModal')).modal('hide');
                    this.notificationsService.success('Успішно', 'Заявку змінено');
                    this.successfulSubmit.emit();
                    this.spinnerButton = false;
                },
                errors => {
                    this.spinnerButton = false;
                    errors.forEach(error => this.notificationsService.error('Помилка', error));
                }
            );
    }

}
