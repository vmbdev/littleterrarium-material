import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

import { PlantService } from '@services/plant.service';
import { Condition } from '@models/plant.model';
import { FormBaseActionComponent } from '@components/form-base-action/form-base-action.component';

type ConditionListItem = {
  id: string;
  color: string;
  name: string;
};

@Component({
  selector: 'ltm-plant-form-condition',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    FormBaseActionComponent,
  ],
  templateUrl: './plant-form-condition.component.html',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantFormConditionComponent {
  private readonly plantService = inject(PlantService);
  private readonly cdr = inject(ChangeDetectorRef);

  protected conditions = this.getConditions();

  ngAfterViewInit() {
    this.cdr.markForCheck();
  }

  getConditions(): ConditionListItem[] {
    return Object.keys(Condition).map((key) => ({
      id: key,
      color: this.plantService.getConditionColor(key),
      name: this.plantService.getConditionDesc(key),
    }));
  }
}
