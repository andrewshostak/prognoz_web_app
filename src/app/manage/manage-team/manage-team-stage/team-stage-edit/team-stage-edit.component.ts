import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TeamStageState } from '@enums/team-stage-state.enum';
import { Tournament } from '@enums/tournament.enum';
import { CompetitionState } from '@enums/competition-state.enum';
import { TeamStageNew } from '@models/new/team-stage-new.model';
import { CompetitionSearch } from '@models/search/competition-search.model';
import { CompetitionNew } from '@models/new/competition-new.model';
import { TeamStageTypeNew } from '@models/new/team-stage-type-new.model';
import { OpenedModal } from '@models/opened-modal.model';
import { TeamStageNewService } from '@services/new/team-stage-new.service';
import { SettingsService } from '@services/settings.service';
import { CompetitionNewService } from '@services/new/competition-new.service';
import { TeamStageTypeNewService } from '@services/new/team-stage-type-new.service';
import { NotificationsService } from 'angular2-notifications';
import { UtilsService } from '@services/utils.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { pick, uniqBy } from 'lodash';

@Component({
   selector: 'app-team-stage-edit',
   templateUrl: './team-stage-edit.component.html',
   styleUrls: ['./team-stage-edit.component.scss']
})
export class TeamStageEditComponent implements OnInit {
   constructor(
      private activatedRoute: ActivatedRoute,
      private competitionService: CompetitionNewService,
      private notificationsService: NotificationsService,
      private ngbModalService: NgbModal,
      private teamStageService: TeamStageNewService,
      private teamStageTypeService: TeamStageTypeNewService,
      private router: Router
   ) {}

   public competitions: CompetitionNew[] = [];
   public openedModal: OpenedModal<TeamStageNew>;
   public teamStageForm: FormGroup;
   public teamStage: TeamStageNew;
   public teamStageStateTypes = TeamStageState;
   public teamStageTypes: TeamStageTypeNew[] = [];

   public deleteTeamStage(): void {
      this.teamStageService.deleteTeamStage(this.openedModal.data.id).subscribe(
         () => {
            this.notificationsService.success('Успішно', `Командну стадію ${this.openedModal.data.title} видалено`);
            this.openedModal.reference.close();
            this.router.navigate(['/manage', 'team', 'stages']);
         },
         () => {
            this.openedModal.reference.close();
         }
      );
   }

   public ngOnInit(): void {
      this.getCompetitionsData();
      this.getTeamStageTypesData();
      this.getTeamStage(this.activatedRoute.snapshot.params.id);
      this.teamStageForm = new FormGroup({
         team_stage_type_id: new FormControl(null, [Validators.required]),
         competition_id: new FormControl(null, [Validators.required]),
         title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
         round: new FormControl(null, [Validators.required, Validators.min(1)])
      });
   }

   public onSubmit(): void {
      if (this.teamStageForm.invalid) {
         return;
      }

      const teamStage = pick(this.teamStage, ['team_stage_type_id', 'competition_id', 'title', 'round', 'state']);
      this.updateTeamStage({ ...teamStage, ...this.teamStageForm.value });
   }

   public openDeleteConfirm(content: NgbModalRef | TemplateRef<any>, data: TeamStageNew, submitted: (event) => void): void {
      const message = `Ви впевнені що хочете видалити ${data.title}?`;
      this.openConfirmModal(content, data, submitted, message);
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   private getCompetitionsData(): void {
      const search: CompetitionSearch = {
         page: 1,
         limit: SettingsService.maxLimitValues.competitions,
         states: [CompetitionState.NotStarted, CompetitionState.Applications, CompetitionState.Active],
         tournamentId: Tournament.Team
      };
      this.competitionService.getCompetitions(search).subscribe(response => {
         this.competitions = uniqBy(this.competitions.concat(response.data), 'id');
      });
   }

   private getTeamStage(id: number): void {
      this.teamStageService.getTeamStage(id, ['competition']).subscribe(response => {
         this.teamStage = response;
         this.handleTeamStageResponse(this.teamStage);
      });
   }

   private getTeamStageTypesData(): void {
      this.teamStageTypeService.getTeamStageTypes().subscribe(response => {
         this.teamStageTypes = response.data;
      });
   }

   private handleTeamStageResponse(teamStage: TeamStageNew): void {
      this.teamStageForm.patchValue(teamStage);
      if (teamStage.competition) {
         this.competitions = uniqBy(this.competitions.concat([teamStage.competition]), 'id');
      }
      switch (teamStage.state) {
         case TeamStageState.Ended:
            this.teamStageForm.disable();
            break;
         case TeamStageState.Active:
            this.teamStageForm.get('team_stage_type_id').disable();
            this.teamStageForm.get('competition_id').disable();
            this.teamStageForm.get('round').disable();
            break;
      }
   }

   private openConfirmModal(
      content: NgbModalRef | TemplateRef<any>,
      data: TeamStageNew,
      submitted: (event) => void,
      message: string
   ): void {
      const reference = this.ngbModalService.open(content, { centered: true });
      this.openedModal = { reference, data, submitted: () => submitted.call(this), message };
   }

   private updateTeamStage(teamStage: Partial<TeamStageNew>): void {
      this.teamStageService.updateTeamStage(this.teamStage.id, teamStage).subscribe(response => {
         this.notificationsService.success('Успішно', `Командну стадію ${response.title} змінено`);
         this.router.navigate(['/manage', 'team', 'stages']);
      });
   }
}
