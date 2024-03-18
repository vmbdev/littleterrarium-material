import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { TaskService } from '@services/task.service';

@Component({
  selector: 'ltm-task-button-water',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './task-button-water.component.html',
  styleUrls: ['./task-button-water.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskButtonWaterComponent {
  protected readonly tasks = inject(TaskService);

  disabled = input(false, { transform: booleanAttribute });
  id = input.required<number>();
}
