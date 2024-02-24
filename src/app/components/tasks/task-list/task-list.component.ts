import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { TaskButtonWaterComponent } from '@components/tasks/task-button-water/task-button-water.component';
import { TaskButtonFertilizeComponent } from '@components/tasks/task-button-fertilize/task-button-fertilize.component';
import { PlantService } from '@services/plant.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { TaskService } from '@services/task.service';

@Component({
  selector: 'ltm-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatRippleModule,
    MatListModule,
    TranslocoModule,
    TaskButtonWaterComponent,
    TaskButtonFertilizeComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  constructor(
    public readonly plantService: PlantService,
    public readonly taskService: TaskService,
    private readonly mt: MainToolbarService,
    private readonly translate: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.mt.setName(this.translate.translate('general.tasks'));
    this.mt.setMenu([]);
    this.mt.setButtons([]);

    // refresh on load
    this.taskService.loadTasks();
  }
}
