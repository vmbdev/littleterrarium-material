import { Injectable, WritableSignal, signal } from '@angular/core';

import { ApiService } from '@services/api.service';
import { PlantService } from '@services/plant.service';
import { Plant } from '@models/plant.model';
import { Task } from '@models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly #$tasks: WritableSignal<Task[]> = signal([]);
  public readonly $tasks = this.#$tasks.asReadonly();
  readonly #$count: WritableSignal<number> = signal(0);
  public readonly $count = this.#$count.asReadonly();

  constructor(
    private readonly api: ApiService,
    private readonly plantService: PlantService,
    private readonly dialog: MatDialog,
    private readonly translate: TranslocoService,
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
      this.#$tasks.set(newTasks);
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

    this.#$count.set(recount);
  }

  openWaterDialog(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.translate('general.watering'),
        question: [
          this.translate.translate('plant-widget-water.confirm'),
          this.translate.translate('plant-widget-water.warning'),
        ],
        accept: () => {
          this.plantService.water(id).subscribe(() => {
            this.loadTasks();
          });
        },
      },
    });
  }

  openFertDialog(id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.translate('general.fertilize'),
        question: [this.translate.translate('plant-widget-fertilizer.confirm')],
        accept: () => {
          this.plantService.fertilize(id).subscribe(() => {
            this.loadTasks();
          });
        },
      },
    });
  }

  empty(): void {
    this.#$count.set(0);
    this.#$tasks.set([]);
  }
}
