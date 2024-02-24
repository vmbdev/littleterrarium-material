import { ChangeDetectionStrategy, Component, Input, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoModule } from '@ngneat/transloco';
import { Observable, map, of } from 'rxjs';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormSpecieComponent implements FormBaseComponent {
  @Input() selected?: number;
  public readonly form = this.fb.group({
    specieId: new FormControl<number | null>(null),
  });

  protected specieName$?: Observable<string>;
  protected readonly $results: WritableSignal<Specie[]> = signal([]);

  constructor(
    private readonly api: ApiService,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    if (this.selected) {
      this.specieName$ = this.api
        .getSpecie(this.selected)
        .pipe(map((specie: Specie) => {
          this.form.patchValue({ specieId: this.selected });;

          return specie.name;
        })
      );
    }
  }

  keyPress(value: string): void {
    if (value.length >= 3) {
      this.api.findSpecie(value).subscribe((res) => {
        this.$results.set(res);
      });
    } else if (value.length === 0) {
      this.form.patchValue({ specieId: null });
      this.$results.set([]);
    }
  }

  selectSpecie(id: number, name: string): void {
    this.specieName$ = of(name);
    this.form.patchValue({
      specieId: id,
    });
  }

  getSpecieName(specie: Specie): string {
    return specie ? specie.name : '';
  }

  clear(): void {
    this.specieName$ = of('');
    this.form.patchValue({ specieId: null });
  }
}
