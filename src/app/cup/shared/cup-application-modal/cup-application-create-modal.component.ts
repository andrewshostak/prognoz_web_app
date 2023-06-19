import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { Competition } from '@models/v2/competition.model';
import { CupApplication } from '@models/v2/cup/cup-application.model';
import { User } from '@models/v2/user.model';
import { CupApplicationService } from '@services/v2/cup-application.service';
import { DeviceService } from '@services/device.service';
import { AuthService } from '@services/v2/auth.service';
import { UserService } from '@services/v2/user.service';
import { UtilsService } from '@services/utils.service';
import { NotificationsService } from 'angular2-notifications';
import { from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
   selector: 'app-cup-application-create-modal',
   templateUrl: './cup-application-create-modal.component.html',
   styleUrls: ['./cup-application-create-modal.component.scss']
})
export class CupApplicationCreateModalComponent implements OnInit {
   @Input() public close: () => void;
   @Input() public competition: Competition;
   @Input() public cupApplication: Partial<CupApplication>;
   @Output() public successfullySubmitted = new EventEmitter<CupApplication>();

   public applicant: User;
   public cupApplicationForm: FormGroup;
   public spinnerButton = false;

   constructor(
      private authService: AuthService,
      private cupApplicationService: CupApplicationService,
      private deviceService: DeviceService,
      private notificationsService: NotificationsService,
      private userService: UserService
   ) {}

   public ngOnInit(): void {
      this.cupApplicationForm = new FormGroup({
         competition_id: new FormControl(this.cupApplication.competition_id, [Validators.required]),
         applicant_id: new FormControl(
            {
               value: this.cupApplication.applicant_id || null,
               disabled: !this.hasModeratorRights()
            },
            [Validators.required]
         )
      });

      if (this.cupApplication.applicant_id) {
         this.getApplicant(this.cupApplication.applicant_id);
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
      this.createCupApplication();
   }

   private createCupApplication(): void {
      this.spinnerButton = true;
      from(this.deviceService.getDevice())
         .pipe(
            catchError(() => of(DeviceService.emptyDevice)),
            mergeMap((device: { fingerprint: string; info: { [key: string]: any } }) =>
               this.cupApplicationService.createCupApplication(this.cupApplicationForm.getRawValue(), device.fingerprint, device.info)
            )
         )
         .subscribe(
            response => {
               this.spinnerButton = false;
               this.notificationsService.success('Успішно', 'Заявку створено');
               this.successfullySubmitted.emit(response);
            },
            () => {
               this.close();
               this.spinnerButton = false;
            }
         );
   }

   private getApplicant(id: number): void {
      this.userService.getUser(id).subscribe(response => (this.applicant = response));
   }

   private hasModeratorRights(): boolean {
      return this.authService.hasPermissions(['create_cup_application_wo_validation']);
   }
}
