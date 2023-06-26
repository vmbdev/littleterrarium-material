import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PlantService } from '@services/plant.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { TaskService } from '@services/task.service';
import { PlantButtonWaterComponent } from '@components/plant/buttons/plant-button-water/plant-button-water.component';
import { PlantButtonFertilizeComponent } from '@components/plant/buttons/plant-button-fertilize/plant-button-fertilize.component';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatRippleModule,
    MatListModule,
    TranslateModule,
    PlantButtonWaterComponent,
    PlantButtonFertilizeComponent,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  constructor(
    public plantService: PlantService,
    public taskService: TaskService,
    private mt: MainToolbarService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.mt.setName(this.translate.instant('general.tasks'));
    this.mt.setMenu([]);
    this.mt.setButtons([]);

    // refresh on load
    this.taskService.loadTasks();
  }
}
