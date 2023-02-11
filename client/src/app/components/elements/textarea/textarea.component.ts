import {Component, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaComponent,
      multi: true
    }]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() placeholder: string = "";
  @Input() errorMessage?: string;
  @Input() rows?: number = 4;
  @Input() maxlength: number | null = null;

  private innerValue: string = '';
  public onChange: (value: string) => void = () => {};
  public onTouch: () => void = () => {}

  constructor() { }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public onBlur(): void {
    this.onTouch();
  }

  set value(val: string){
    if (val !== this.innerValue) {
      this.innerValue = val;
      this.onChange(val);
    }
  }

  get value(): string {
    return this.innerValue;
  };

  writeValue(val: string): void {
    if (val !== this.innerValue) {
      this.innerValue = val;
    }
  }

}
