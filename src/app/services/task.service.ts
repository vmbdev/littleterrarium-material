import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '@services/api.service';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { Task } from '@models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);
  public readonly tasks$ = this.tasks.asObservable();
  private count = new BehaviorSubject<number>(0);
  public readonly count$ = this.count.asObservable();

  constructor(
    private readonly api: ApiService,
    private readonly plantService: PlantService,
  ) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.api.getTasks().subscribe((plants: Plant[]) => {
      const newTasks: Task[] = [];

      this.countTasks(plants);
      
      for (const plant of plants) {
        newTasks.push({
          plantId: plant.id,
          picture: this.plantService.coverPhoto(plant) ?? undefined,
          plantName: this.plantService.getVisibleName(plant),
          waterNext: plant.waterNext,
          fertNext: plant.fertNext,
        });
      }
      this.tasks.next(newTasks);
    });
  }

  /**
   * Each task represents a plant. The presence of waterNext or fertNext is a
   * task each.
   */
  countTasks(plants: Plant[]): void {
    let recount = 0;
    
    for (const plant of plants) {
      if (plant.waterNext) recount++;
      if (plant.fertNext) recount++;
    }

    this.count.next(recount);
  }

  empty(): void {
    this.count.next(0);
    this.tasks.next([]);
  }
}
