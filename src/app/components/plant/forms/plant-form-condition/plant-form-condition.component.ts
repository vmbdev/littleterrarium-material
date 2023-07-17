import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Condition } from '@models/plant.model';
import { PlantService } from '@services/plant.service';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'plant-form-condition',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './plant-form-condition.component.html',
  styleUrls: ['./plant-form-condition.component.scss']
})
export class PlantFormConditionComponent implements FormBaseComponent {
  @Input() currentCondition: Condition | null = 'GOOD';
  form = this.fb.group({ condition: [''] });
  plantConditions = Condition;

  constructor(
    private fb: FormBuilder,
    public plantService: PlantService
  ) {}

  ngOnInit(): void {
    this.form.patchValue({ condition: this.currentCondition })
  }

  getFormConditionDesc(): string | null {
    const value = this.form.get('condition')?.value;

    return value ? this.plantConditions[value] : null;
  }

  /**
   * Just to pass to the keyvalue, we don't want it to sort the conditions
   * @returns 0
   */
  noSort() {
    return 0
  }
}
