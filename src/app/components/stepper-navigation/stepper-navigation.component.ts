import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'stepper-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule
  ],
  templateUrl: './stepper-navigation.component.html',
  styleUrls: ['./stepper-navigation.component.scss']
})
export class StepperNavigationComponent {
  @Input() backButton: boolean | 'true' | 'false' = true;
  @Input() finishButton: boolean | 'true' | 'false' = false;
  @Output() finish = new EventEmitter();

  emitFinish() {
    this.finish.emit();
  }
}
