import { ChangeDetectionStrategy, Component, forwardRef, model } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Toggle custom component. Can work either as a FormControl or just through
 * the checked input and the checkedChange output.
 */
@Component({
  selector: 'ltm-toggle-option',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatRippleModule,
  ],
  templateUrl: './toggle-option.component.html',
  styleUrls: ['./toggle-option.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleOptionComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleOptionComponent implements ControlValueAccessor {
  checked = model<boolean>(false);
  disabled: boolean = false;

  private onChange = (val: boolean) => {};
  private onTouched = () => {};

  writeValue(val: boolean): void {
    this.checked.set(val);
    this.onChange(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  change(val: boolean) {
    this.checked.set(val);
    this.onChange(val);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleOption(): void {
    this.checked.update((val) => !val);
    this.onChange(this.checked());
  }
}
