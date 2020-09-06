import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { Competition } from '@models/competition.model';
import { CupApplication } from '@models/cup/cup-application.model';
import { UserNew } from '@models/new/user-new.model';
import { CupApplicationService } from '@services/cup/cup-application.service';
import { DeviceService } from '@services/device.service';
import { AuthNewService } from '@services/new/auth-new.service';
import { UserNewService } from '@services/new/user-new.service';
import { SettingsService } from '@services/settings.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-cup-application-modal',
   templateUrl: './cup-application-modal.component.html',
   styleUrls: ['./cup-application-modal.component.scss']
})
export class CupApplicationModalComponent implements OnInit {
   @Input() public close: () => void;
   @Input() public competition: Competition;
   @Input() public cupApplication: Partial<CupApplication>;
   @Output() public successfullySubmitted = new EventEmitter<void>();

   public anyUser = { id: null, name: 'Будь-хто' } as UserNew;
   public applicant: UserNew;
   public cupApplicationForm: FormGroup;
   public places = SettingsService.cupApplicationPlaces;
   public receiver: UserNew;
   public spinnerButton = false;

   constructor(
      private authNewService: AuthNewService,
      private cupApplicationService: CupApplicationService,
      private deviceService: DeviceService,
      private notificationsService: NotificationsService,
      private userNewService: UserNewService
   ) {}

   public isFriendlyCompetition(): boolean {
      if (this.competition) {
         return !this.competition.participants;
      }
      return false;
   }

   public ngOnInit(): void {
      this.cupApplicationForm = new FormGroup({
         competition_id: new FormControl(this.cupApplication.competition_id, [Validators.required]),
         applicant_id: new FormControl(
            {
               value: this.cupApplication.applicant_id || null,
               disabled: !this.hasModeratorRights()
            },
            [Validators.required]
         ),
         receiver_id: new FormControl(this.cupApplication.receiver_id || null),
         place: new FormControl(this.cupApplication.place)
      });

      if (this.cupApplication.applicant_id) {
         this.getApplicant(this.cupApplication.applicant_id);
      }

      if (this.cupApplication.receiver_id) {
         this.getReceiver(this.cupApplication.receiver_id);
      }
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public submit(): void {
      if (this.cupApplicationForm.invalid) {
         return;
      }
      this.spinnerButton = true;
      this.cupApplication.id ? this.updateCupApplication() : this.createCupApplication();
   }

   private createCupApplication(): void {
      from(this.deviceService.getDevice())
         .pipe(
            catchError(() => of(DeviceService.emptyDevice)),
            mergeMap((device: { fingerprint: string; info: { [key: string]: any } }) =>
               this.cupApplicationService.createCupApplication(this.cupApplicationForm.getRawValue(), device.fingerprint, device.info)
            )
         )
         .subscribe(
            () => {
               this.notificationsService.success('Успішно', 'Заявку створено');
               this.successfullySubmitted.emit();
               this.spinnerButton = false;
            },
            errors => {
               this.spinnerButton = false;
               errors.forEach(error => this.notificationsService.error('Помилка', error));
            }
         );
   }

   private getApplicant(id: number): void {
      this.userNewService.getUser(id).subscribe(response => (this.applicant = response));
   }

   private getReceiver(id: number): void {
      this.userNewService.getUser(id).subscribe(response => (this.receiver = response));
   }

   private hasModeratorRights(): boolean {
      if (this.cupApplication.id) {
         return this.authNewService.hasPermissions(['update_cup_application_wo_validation']);
      } else {
         return this.authNewService.hasPermissions(['create_cup_application_wo_validation']);
      }
   }

   private updateCupApplication(): void {
      this.cupApplicationService.updateCupApplication(this.cupApplicationForm.getRawValue(), this.cupApplication.id).subscribe(
         () => {
            this.notificationsService.success('Успішно', 'Заявку змінено');
            this.successfullySubmitted.emit();
            this.spinnerButton = false;
         },
         errors => {
            this.spinnerButton = false;
            errors.forEach(error => this.notificationsService.error('Помилка', error));
         }
      );
   }
}
