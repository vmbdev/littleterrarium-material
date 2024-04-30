import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { FabComponent } from '@components/fab/fab.component';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { PlantEditComponent } from '@components/plant/plant-edit/plant-edit.component';
import { PlantMenuWaterComponent } from '@components/plant/menu/plant-menu-water/plant-menu-water.component';
import { PlantMenuFertComponent } from '@components/plant/menu/plant-menu-fert/plant-menu-fert.component';
import { AuthService } from '@services/auth/auth.service';
import { PlantGetConfig } from '@services/api/api.service';
import { LocationService } from '@services/location/location.service';
import { PlantService } from '@services/plant/plant.service';
import { SearchService } from '@services/search/search.service';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { BottomScrollDetectorService } from '@services/bottom-scroll/bottom-scroll-detector.service';
import { Plant } from '@models/plant.model';
import { SortColumn, SortOrder } from '@models/sort-options.model';
import { CapitalizePipe } from '@pipes/capitalize/capitalize.pipe';

type PlantListItem = {
  id: number;
  name: string;
  cover?: string;
};

@Component({
  selector: 'ltm-plant-list',
  standalone: true,
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatGridListModule,
    MatListModule,
    TranslocoModule,
    FabComponent,
    PlantMenuWaterComponent,
    PlantMenuFertComponent,
    CapitalizePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantListComponent {
  private readonly auth = inject(AuthService);
  private readonly plantService = inject(PlantService);
  private readonly locationService = inject(LocationService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslocoService);
  private readonly bottomSheet = inject(MatBottomSheet);
  private readonly search = inject(SearchService);
  private readonly mt = inject(MainToolbarService);
  private readonly bottomScrollDetector = inject(BottomScrollDetectorService);

  locationId = input<number>();
  userId = input<number>();
  protected $list: WritableSignal<PlantListItem[]> = signal([]);

  private cursor?: number;
  private lastCursor?: number;

  protected breakpoint: number = 2;

  private filter: string | null = null;
  private order: SortOrder = 'asc';

  /**
   * Defines the sorting column. We make it a signal so we can compute the
   * signals to be sent to MainToolbarService automatically.
   */
  private column = signal<SortColumn>('name');

  /**
   * The menus of MainToolbar
   */
  private readonly $nameSelected: Signal<boolean> = computed(
    () => this.column() === 'name',
  );
  private readonly $dateSelected: Signal<boolean> = computed(
    () => this.column() === 'date',
  );
  protected $listView = signal<boolean>(false);

  /**
   * Just for convenience to pass to MainToolbarService
   */
  private $cardView: Signal<boolean> = computed(() => !this.$listView());

  readonly searchUpdate = effect(() => {
    const res = this.search.$text();

    if (res.mode !== 'Begin') {
      this.filter = res.value;
      untracked(() => {
        this.fetchPlants();
      });
    }
  });

  readonly bottomDetected = effect(() => {
    if (this.bottomScrollDetector.$detected()) {
      if (this.cursor !== this.lastCursor) this.fetchPlants(true);
    }
  });

  ngOnInit(): void {
    const storedOrder = this.auth.getPref('plantListOrder');
    const storedSort = this.auth.getPref('plantListSort');
    const storedView = this.auth.getPref('plantListView');

    if (storedOrder && (storedOrder === 'asc' || storedOrder === 'desc')) {
      this.order = storedOrder;
    }

    if (storedSort && (storedSort === 'name' || storedSort === 'date')) {
      this.column.set(storedSort);
    }

    this.$listView.set(!!storedView);

    this.computeBreakpoint(window.innerWidth);
    this.fetchPlants();
    this.createMainToolbarContext();
  }

  ngOnDestroy() {
    this.search.reset();
  }

  @HostListener('window:resize', ['$event'])
  onResizeWindow(event: Event) {
    const target = event.target as Window;

    this.computeBreakpoint(target.innerWidth);
  }

  computeBreakpoint(width: number) {
    if (width <= 480) this.breakpoint = 2;
    else if (width >= 1280) this.breakpoint = 7;
    else this.breakpoint = 4;
  }

  fetchPlants(scroll: boolean = false): void {
    const locationId = this.locationId();
    const userId = this.userId();
    let obs: Observable<Plant[]>;
    let options: PlantGetConfig = {
      cursor: scroll && this.cursor ? this.cursor : undefined,
      filter: this.filter ?? '',
      sort: this.column(),
      order: this.order,
    };

    // in case of multiple bottom reached signals, we avoid asking twice
    if (this.cursor) this.lastCursor = this.cursor;

    if (locationId) {
      obs = this.locationService.getPlants(locationId, options);
    } else {
      options = {
        ...options,
        userId,
        cover: true,
      };

      obs = this.plantService.getMany(options);
    }

    obs.subscribe((plants: Plant[]) => {
      if (plants.length > 0) {
        const newList: PlantListItem[] = this.createPlantList(plants);

        this.cursor = plants[plants.length - 1].id;

        if (scroll) {
          this.$list.update((value) => [...value, ...newList]);
        } else this.$list.set(newList);
      } else if (!scroll) this.$list.set([]);
    });
  }

  createPlantList(plants: Plant[]): PlantListItem[] {
    let newList: PlantListItem[] = [];

    for (const plant of plants) {
      newList.push({
        id: plant.id,
        name: this.plantService.getVisibleName(plant),
        cover: this.plantService.coverPhoto(plant),
      });
    }

    return newList;
  }

  createMainToolbarContext(): void {
    this.mt.addButtons([
      {
        icon: 'search',
        tooltip: 'general.search',
        click: () => {
          this.search.toggle();
        },
      },
    ]);
    this.mt.addButtonsToMenu([
      [
        {
          icon: 'view_list',
          tooltip: 'general.viewList',
          click: () => {
            this.setSmallView(true);
          },
          $selected: this.$listView,
        },
        {
          icon: 'grid_view',
          tooltip: 'general.viewCards',
          click: () => {
            this.setSmallView(false);
          },
          $selected: this.$cardView,
        },
      ],
      [
        {
          icon: 'sort_by_alpha',
          tooltip: 'sort.alphabetically',
          click: () => {
            this.toggleSortColumn('name');
          },
          $selected: this.$nameSelected,
        },
        {
          icon: 'history',
          tooltip: 'sort.date',
          click: () => {
            this.toggleSortColumn('date');
          },
          $selected: this.$dateSelected,
        },
      ],
    ]);
  }

  toggleSortColumn(column: SortColumn) {
    if (this.column() !== column) {
      this.column.set(column);
      // when a new sortable column is chosen, we order 'asc' by default
      this.order = 'asc';
    } else this.toggleSortOrder();

    this.storeSortOptions();
    this.fetchPlants();
  }

  toggleSortOrder() {
    this.order = this.order === 'asc' ? 'desc' : 'asc';
  }

  storeSortOptions() {
    this.auth
      .setPref({
        plantListSort: this.column(),
        plantListOrder: this.order,
      })
      .subscribe();
  }

  setSmallView(val: boolean) {
    this.auth.setPref({ plantListView: val }).subscribe();
    this.$listView.set(val);
  }

  openRemoveDialog(name: string, id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: name,
        question: [this.translate.translate('plant.remove')],
        accept: () => {
          this.delete(id);
        },
      },
    });
  }

  openEdit(id: number): void {
    const bsRef = this.bottomSheet.open(PlantEditComponent, {
      data: {
        id,
        config: { cover: true },
      },
    });

    bsRef.afterDismissed().subscribe((updatedPlant: Plant) => {
      if (updatedPlant) {
        const index = this.$list().findIndex(
          (plant) => plant.id === updatedPlant.id,
        );

        // we moved the plant, hence we remove it from the list
        if (
          this.locationId() &&
          updatedPlant.locationId !== this.locationId()
        ) {
          this.$list.update((value) => {
            const list = [...value];
            list.splice(index, 1);

            return list;
          });
        } else {
          this.$list.update((value) => {
            const list = [...value];
            list[index] = {
              id: updatedPlant.id,
              name: this.plantService.getVisibleName(updatedPlant),
              cover: this.plantService.coverPhoto(updatedPlant),
            };

            return list;
          });
        }
      }
    });
  }

  delete(id: number): void {
    this.plantService.delete(id).subscribe(() => {
      this.$list.update((value) =>
        value.filter((item: PlantListItem) => item.id !== id),
      );
    });
  }
}
