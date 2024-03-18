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
  selector: 'ltm-task-button-fertilize',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './task-button-fertilize.component.html',
  styleUrls: ['./task-button-fertilize.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskButtonFertilizeComponent {
  protected readonly tasks = inject(TaskService);

  disabled = input(false, { transform: booleanAttribute });
  id = input.required<number>();

}
