import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { ApiService } from '@services/api.service';
import { Specie } from '@models/specie.model';

@Component({
  selector: 'ltm-plant-form-specie',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './plant-form-specie.component.html',
})
export class PlantFormSpecieComponent implements FormBaseComponent {
  @Input() currentSpecie?: number | null;
  form = this.fb.group({ specieId: new FormControl<number | null>(null) });
  results$ = new BehaviorSubject<Specie[]>([]);
  currentSpecieName?: string;

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.currentSpecie) {
      this.api.getSpecie(this.currentSpecie).subscribe((specie: Specie) => {
        this.form.patchValue({ specieId: this.currentSpecie });
        this.currentSpecieName = specie.name;
      });
    }
  }

  keyPress(value: string): void {
    if (value.length >= 3) {
      this.api.findSpecie(value).subscribe((res) => {
        this.results$.next(res);
      });
    } else if (value.length === 0) {
      this.form.patchValue({ specieId: null });
      this.results$.next([]);
    }
  }

  selectSpecie(id: number): void {
    this.form.patchValue({
      specieId: id,
    });
  }

  getSpecieName(specie: Specie): string {
    return specie ? specie.name : '';
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.form.patchValue({ specieId: null });
  }
}
