import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { TaskButtonWaterComponent } from '@components/tasks/task-button-water/task-button-water.component';
import { TaskButtonFertilizeComponent } from '@components/tasks/task-button-fertilize/task-button-fertilize.component';
import { PlantService } from '@services/plant/plant.service';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { TaskService } from '@services/task/task.service';
import { LimitLargeScreenDirective } from '@directives/limit-large-screen/limit-large-screen.directive';

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
    LimitLargeScreenDirective,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  protected readonly plantService = inject(PlantService);
  protected readonly taskService = inject(TaskService);
  private readonly mt = inject(MainToolbarService);
  private readonly translate = inject(TranslocoService);

  ngOnInit(): void {
    this.mt.setName(this.translate.translate('general.tasks'));
    this.mt.setMenu([]);
    this.mt.setButtons([]);

    // refresh on load
    this.taskService.loadTasks();
  }
}
