import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
   @Input() public fileExtensions: string[];

   public onChange: (file: File) => void;
   public onTouched: () => void;
   public file: File | null = null;

   constructor(private elementRef: ElementRef<HTMLInputElement>) {}

   @HostListener('change', ['$event.target.files']) public emitFiles(event: FileList) {
      const f = event && event.item(0);
      this.onChange(f);
      this.file = f;
      this.onTouched();
   }

   get acceptAttributeValue(): string {
      return this.fileExtensions ? this.fileExtensions.map(extension => '.' + extension).join(',') : '*';
   }

   public registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   public registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   public writeValue(value: null): void {
      this.elementRef.nativeElement.value = '';
      this.file = null;
   }
}
