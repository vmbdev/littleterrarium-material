import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
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
  @Input({ transform: booleanAttribute }) backButton: boolean = true;
  @Input({ transform: booleanAttribute }) finishButton: boolean = false;
  @Output() finish = new EventEmitter();

  emitFinish() {
    this.finish.emit();
  }
}
