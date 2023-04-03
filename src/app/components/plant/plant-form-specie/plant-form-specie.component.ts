import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiService } from '@services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Specie } from '@models/specie.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'plant-form-specie',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './plant-form-specie.component.html',
  styleUrls: ['./plant-form-specie.component.scss']
})
export class PlantFormSpecieComponent {
  form = this.fb.group({
    specieId: new FormControl<number | null>(null)
  });
  results$ = new BehaviorSubject<Specie[]>([]);

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {}

  keyPress(value: string): void {
    if (value.length >= 3) {
      this.api.findSpecie(value).subscribe((res) => {
        this.results$.next(res);
      })
    }
    else if (value.length === 0) {
      this.results$.next([]);
    }
  }

  selectSpecie(id: number): void {
    this.form.patchValue({
      specieId: id
    });
  }

  getSpecieName(specie: Specie): string {
    return specie ? specie.name : '';
  }

  clear(input: HTMLInputElement): void {
    input.value = '';
    this.form.patchValue({
      specieId: null
    });
  }
}
