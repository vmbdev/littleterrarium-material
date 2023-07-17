import { Component, Input, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { FabComponent } from '@components/fab/fab.component';
import { PlantEditComponent } from '@components/plant/plant-edit/plant-edit.component';
import { PlantToolbarComponent } from '@components/plant/plant-toolbar/plant-toolbar.component';
import { PlantGetConfig } from '@services/api.service';
import { LocationService } from '@services/location.service';
import { PlantService } from '@services/plant.service';
import { SearchReceipt, SearchService } from '@services/search.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { AuthService } from '@services/auth.service';
import { BottomScrollDetectorService } from '@services/bottom-scroll-detector.service';
import { User } from '@models/user.model';
import { Plant } from '@models/plant.model';
import { SortColumn, SortOrder } from '@models/sort-options.model';
import { CapitalizePipe } from "@pipes/capitalize/capitalize.pipe";
import { PlantMenuWaterComponent } from '../menu/plant-menu-water/plant-menu-water.component';
import { PlantMenuFertComponent } from '../menu/plant-menu-fert/plant-menu-fert.component';

@Component({
  selector: 'plant-list',
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
    TranslateModule,
    FabComponent,
    PlantToolbarComponent,
    PlantMenuWaterComponent,
    PlantMenuFertComponent,
    CapitalizePipe
  ]
})
export class PlantListComponent {
  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() user?: User;
  owned: boolean = true;
  list$ = new BehaviorSubject<Plant[]>([]);
  search$?: Subscription;
  smallView: boolean;

  cursor?: number;
  lastCursor?: number;

  filter: string | null = null;
  order: SortOrder;
  sort: SortColumn;

  // subjects for the menus of MainToolbar
  nameSelected$: BehaviorSubject<boolean>;
  dateSelected$: BehaviorSubject<boolean>;
  listView$: BehaviorSubject<boolean>;
  cardView$: BehaviorSubject<boolean>;

  constructor(
    private auth: AuthService,
    private plantService: PlantService,
    private locationService: LocationService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private search: SearchService,
    private mt: MainToolbarService,
    private bottomScrollDetector: BottomScrollDetectorService
  ) {
    this.smallView = (localStorage.getItem('LT_plantListView') === 'true');
    this.listView$ = new BehaviorSubject<boolean>(this.smallView);
    this.cardView$ = new BehaviorSubject<boolean>(!this.smallView);

    const order = localStorage.getItem('LT_plantListOrder');
    const sort = localStorage.getItem('LT_plantListSort');

    if (order === 'asc') this.order = 'asc';
    else this.order = 'desc';

    if (sort === 'name') {
      this.sort = sort;
      this.nameSelected$ = new BehaviorSubject<boolean>(true);
      this.dateSelected$ = new BehaviorSubject<boolean>(false);
    }
    else {
      this.sort = 'date';
      this.nameSelected$ = new BehaviorSubject<boolean>(false);
      this.dateSelected$ = new BehaviorSubject<boolean>(true);
    }

    this.detectBottomReached();
  }

  ngOnInit(): void {
    if (this.user?.id) {
      this.owned = this.auth.isSameUser('id', this.user.id);
    }

    if (this.list) this.list$.next(this.list);
    else this.fetchPlants();

    this.createMainToolbarContext();

    this.search$ = this.search.text$.subscribe((res: SearchReceipt) => {
      if (res.mode !== 'Begin') {
        this.filter = res.value;
        this.fetchPlants()
      }
    });
  }

  ngOnDestroy(): void {
    if (this.search$) this.search$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationId'] && changes['locationId'].previousValue) {
      if (changes['locationId'].previousValue !== changes['locationId'].currentValue) {
        this.fetchPlants();
      }
    }
  }
  
  fetchPlants(scroll: boolean = false): void {
    let obs: Observable<Plant[]>;
    let options: PlantGetConfig = {
      cursor: scroll && this.cursor ? this.cursor : undefined,
      filter: this.filter ? this.filter : '',
      sort: this.sort,
      order: this.order
    }

    // in case of multiple bottom reached signals, we avoid asking twice
    if (this.cursor) this.lastCursor = this.cursor;

    if (this.locationId) {
      obs = this.locationService.getPlants(this.locationId, options);
    }
    else {
      options = {
        ...options,
        userId: this.user?.id,
        cover: true
      };

      obs = this.plantService.getMany(options);
    }

    obs.subscribe((plants: Plant[]) => {
      if (plants.length > 0) {
        this.cursor = plants[plants.length - 1].id;
      }

      if (scroll) {
        const currentList = this.list$.getValue();

        this.list$.next([...currentList, ...plants]);
      }
      else this.list$.next(plants);
    });
  }

  createMainToolbarContext(): void {
    this.mt.addButtons([
      { icon: 'search', tooltip: 'general.search', click: () => { this.search.toggle() } },
    ]);
    this.mt.addButtonsToMenu([
      [
        {
          icon: 'view_list',
          tooltip: 'general.viewList',
          click: () => { this.setSmallView(true) },
          selected: this.listView$
        },
        {
          icon: 'grid_view',
          tooltip: 'general.viewCards',
          click: () => { this.setSmallView(false) },
          selected: this.cardView$
        }
      ],
      [
        {
          icon: 'sort_by_alpha',
          tooltip: 'sort.alphabetically',
          click: () => { this.toggleSortColumn('name') },
          selected: this.nameSelected$
        },
        {
          icon: 'history',
          tooltip: 'sort.date',
          click: () => { this.toggleSortColumn('date') },
          selected: this.dateSelected$
        },
      ],
    ])
  }

  detectBottomReached(): void {
    this.bottomScrollDetector.detected$
    .pipe(takeUntilDestroyed())
    .subscribe((reachedBottom: boolean) => {
      if (reachedBottom && (this.cursor !== this.lastCursor)) {
        this.fetchPlants(true);
      }
    })
  }

  toggleSortColumn(column: SortColumn) {
    if (this.sort !== column) {
      this.sort = column;
      // when a new sortable column is chosen, we order 'asc' by default
      this.order = 'asc';
    }
    else this.toggleSortOrder();

    this.nameSelected$.next(column === 'name');
    this.dateSelected$.next(column === 'date');
    this.storeSortOptions();

    this.fetchPlants();
  }

  toggleSortOrder() {
    this.order = (this.order === 'asc') ? 'desc' : 'asc';
  }

  storeSortOptions() {
    localStorage.setItem('LT_plantListOrder', this.order.toString());
    localStorage.setItem('LT_plantListSort', this.sort.toString());
  }

  setSmallView(val: boolean) {
    this.smallView = val;
    localStorage.setItem('LT_plantListView', val.toString());

    this.listView$.next(val);
    this.cardView$.next(!val);
  }

  getName(plant: Plant): string {
    return this.plantService.getVisibleName(plant);
  }

  getImgUrl(plant: Plant): string {
    return this.plantService.coverPhoto(plant);
  }

  openRemoveDialog(name: string, id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: name,
        question: [this.translate.instant('plant.remove')],
        accept: () => { this.delete(id) }
      },
    });
  }

  openEdit(id: number): void {
    const bsRef = this.bottomSheet.open(PlantEditComponent, {
      data: {
        id,
        config: { cover: true }
      }
    });

    bsRef.afterDismissed().subscribe((updatedPlant: Plant) => {
      if (updatedPlant) {
        const list = this.list$.getValue();
        const index = list.findIndex((plant) => plant.id === updatedPlant.id);

        // we moved the plant, hence we remove it from the list
        if (this.locationId && (updatedPlant.locationId !== this.locationId)) {
          list.splice(index, 1);
        }
        else list[index] = updatedPlant;

        this.list$.next(list);
      }

    });
  }

  delete(id: number): void {
    this.plantService.delete(id).subscribe(() => {
      const newList = this.list$.getValue().filter((plant: Plant) => plant.id !== id);

      this.list$.next(newList);
    })
  }
}
