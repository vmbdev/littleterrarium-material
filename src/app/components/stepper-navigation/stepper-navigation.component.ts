import {
  booleanAttribute,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ltm-stepper-navigation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    TranslateModule
  ],
  templateUrl: './stepper-navigation.component.html',
  styleUrls: ['./stepper-navigation.component.scss']
})
export class StepperNavigationComponent {
  @Input({ transform: booleanAttribute }) backButton: boolean = true;
  @Input({ transform: booleanAttribute }) finishButton: boolean = false;
  @Output() finish = new EventEmitter();

  emitFinish() {
    this.finish.emit();
  }
}
