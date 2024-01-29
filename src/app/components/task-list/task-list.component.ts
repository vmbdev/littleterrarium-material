import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { PlantButtonWaterComponent } from '@components/plant/buttons/plant-button-water/plant-button-water.component';
import { PlantButtonFertilizeComponent } from '@components/plant/buttons/plant-button-fertilize/plant-button-fertilize.component';
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
    PlantButtonWaterComponent,
    PlantButtonFertilizeComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
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
