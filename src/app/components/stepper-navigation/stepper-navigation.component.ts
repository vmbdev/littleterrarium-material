import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'ltm-stepper-navigation',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatStepperModule, TranslocoModule],
  templateUrl: './stepper-navigation.component.html',
  styleUrls: ['./stepper-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperNavigationComponent {
  backButton = input(true, { transform: booleanAttribute });
  finishButton = input(false, { transform: booleanAttribute });
  finish = output();

  emitFinish() {
    this.finish.emit();
  }
}
