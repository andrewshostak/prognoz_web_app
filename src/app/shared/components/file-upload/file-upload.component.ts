import { Component, ElementRef, forwardRef, HostListener } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UtilsService } from '@services/utils.service';

@Component({
   selector: 'app-file-upload',
   templateUrl: './file-upload.component.html',
   styleUrls: ['./file-upload.component.scss'],
   providers: [
      {
         provide: NG_VALUE_ACCESSOR,
         useExisting: forwardRef(() => FileUploadComponent),
         multi: true
      }
   ]
})
export class FileUploadComponent implements ControlValueAccessor {
   public onChange: (file: File) => void;
   private file: File | null = null;

   constructor(private elementRef: ElementRef<HTMLInputElement>) {}

   @HostListener('change', ['$event.target.files']) public emitFiles(event: FileList) {
      const f = event && event.item(0);
      this.onChange(f);
      this.file = f;
   }

   public showFormErrorMessage(abstractControl: AbstractControl, errorKey: string): boolean {
      return UtilsService.showFormErrorMessage(abstractControl, errorKey);
   }

   public showFormInvalidClass(abstractControl: AbstractControl): boolean {
      return UtilsService.showFormInvalidClass(abstractControl);
   }

   public writeValue(value: null): void {
      this.elementRef.nativeElement.value = '';
      this.file = null;
   }

   public registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   public registerOnTouched(fn: any): void {}
}
