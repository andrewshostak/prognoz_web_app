import { Component, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-manage-team-stage',
   templateUrl: './manage-team-stage.component.html',
   styleUrls: ['./manage-team-stage.component.scss']
})
export class ManageTeamStageComponent {
   constructor(private ngbModalService: NgbModal) {}

   private generationModalReference: NgbModalRef;

   public openGenerationModal(content: NgbModalRef | TemplateRef<any>): void {
      this.generationModalReference = this.ngbModalService.open(content);
   }

   public teamStageGenerationModalSubmitted(): void {
      this.generationModalReference.close();
   }
}
