import { Component, TemplateRef } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
   selector: 'app-manage-team-team-match',
   templateUrl: './manage-team-team-match.component.html',
   styleUrls: ['./manage-team-team-match.component.scss']
})
export class ManageTeamTeamMatchComponent {
   constructor(private ngbModalService: NgbModal) {}

   private generationModalReference: NgbModalRef;

   public openGenerationModal(content: NgbModalRef | TemplateRef<Element>): void {
      this.generationModalReference = this.ngbModalService.open(content, { size: 'lg' });
   }

   public teamTeamMatchGenerationModalSubmitted(): void {
      this.generationModalReference.close();
   }
}
