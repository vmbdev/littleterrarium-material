import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { FormBaseComponent } from '@components/form-base/form-base.component';
import { PlantService } from '@services/plant.service';
import { Condition } from '@models/plant.model';

type ConditionListItem = {
  id: string;
  color: string;
  name: string;
}

@Component({
  selector: 'ltm-plant-form-condition',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './plant-form-condition.component.html',
})
export class PlantFormConditionComponent implements FormBaseComponent {
  @Input() currentCondition: Condition | null = Condition.GOOD;
  public readonly form = this.fb.group({ condition: [''] });
  protected conditions = this.getConditions();

  constructor(
    private fb: FormBuilder,
    public plantService: PlantService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.currentCondition) {
      this.form.patchValue({ condition: this.currentCondition });
    }
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  getConditions(): ConditionListItem[] {
    return Object.keys(Condition).map((key) => ({
      id: key,
      color: this.plantService.getConditionColor(key),
      name: this.plantService.getConditionDesc(key),
    }));
  }
}
