import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthNewService } from '@services/v2/auth-new.service';
import { isNil } from 'lodash';

@Directive({
   selector: '[appHasPermissions]'
})
export class HasPermissionsDirective {
   private thenTemplateRef: TemplateRef<any>;
   private elseTemplateRef: TemplateRef<any>;

   constructor(
      private authService: AuthNewService,
      private elementRef: ElementRef,
      private templateRef: TemplateRef<any>,
      private viewContainerRef: ViewContainerRef
   ) {}

   @Input()
   set appHasPermissions(params: { permissions: string[]; or?: boolean; otherCondition?: boolean }) {
      params.otherCondition = isNil(params.otherCondition) ? true : params.otherCondition;
      if (params && params.permissions && this.authService.hasPermissions(params.permissions, params.or) && params.otherCondition) {
         this.thenTemplateRef = this.templateRef;
         this.updateView();
      }
   }

   @Input()
   set appHasPermissionsElse(templateRef: TemplateRef<any>) {
      this.elseTemplateRef = templateRef;
      this.updateView();
   }

   private updateView(): void {
      if (this.thenTemplateRef) {
         this.viewContainerRef.clear();
         this.elseTemplateRef = null;
         this.viewContainerRef.createEmbeddedView(this.thenTemplateRef, this.elementRef);
      } else if (this.elseTemplateRef) {
         this.viewContainerRef.clear();
         this.thenTemplateRef = null;
         this.viewContainerRef.createEmbeddedView(this.elseTemplateRef, this.elementRef);
      } else {
         this.viewContainerRef.clear();
      }
   }
}
