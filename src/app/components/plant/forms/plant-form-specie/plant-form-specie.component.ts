import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable, map, of } from 'rxjs';

import { ApiService } from '@services/api/api.service';
import { Specie } from '@models/specie.model';
import { FullWidthDirective } from '@directives/full-width/full-width.directive';

@Component({
  selector: 'ltm-plant-form-specie',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslocoModule,
    FullWidthDirective,
  ],
  templateUrl: './plant-form-specie.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlantFormSpecieComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormSpecieComponent implements ControlValueAccessor {
  private readonly api = inject(ApiService);

  protected specieName$?: Observable<string>;
  protected results$?: Observable<Specie[]>;
  protected disabled: boolean = false;

  private onChange = (val: number | null) => {};

  writeValue(val: number): void {
    if (val) {
      this.specieName$ = this.api.getSpecie(val).pipe(
        map((specie: Specie) => {
          this.onChange(val);

          return specie.name;
        }),
      );
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  change(val: string) {
    if (val.length >= 3) {
      this.results$ = this.api.findSpecie(val);
    } else if (val.length === 0) {
      this.onChange(null);
      this.results$ = undefined;
    }
  }

  registerOnTouched(fn: any): void {}

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  selectSpecie(id: number, name: string): void {
    this.specieName$ = of(name);
    this.onChange(id);
  }

  getSpecieName(specie: Specie): string {
    return specie ? specie.name : '';
  }

  clear(): void {
    this.specieName$ = of('');
    this.results$ = undefined;
    this.onChange(null);
  }
}
