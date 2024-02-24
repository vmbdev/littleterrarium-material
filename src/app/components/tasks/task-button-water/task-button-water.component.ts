import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  Input,
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
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  public readonly id = input.required<number>();

  protected readonly tasks = inject(TaskService);
}
