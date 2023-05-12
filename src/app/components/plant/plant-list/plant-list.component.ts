import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { TranslateService } from '@ngx-translate/core';

import { Plant } from '@models/plant.model';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { FabComponent } from '@components/fab/fab.component';
import { PlantEditComponent } from '@components/plant/plant-edit/plant-edit.component';
import { PlantToolbarComponent } from '@components/plant/plant-toolbar/plant-toolbar.component';
import { PlantGetConfig } from '@services/api.service';
import { LocationService } from '@services/location.service';
import { PlantService } from '@services/plant.service';
import { SearchService } from '@services/search.service';
import { MainToolbarService } from '@services/main-toolbar.service';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'plant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatRippleModule,
    MatBottomSheetModule,
    FabComponent,
    PlantToolbarComponent
  ],
  templateUrl: './plant-list.component.html',
  styleUrls: ['./plant-list.component.scss']
})
export class PlantListComponent {
  @Input() list?: Plant[];
  @Input() locationId?: number;
  @Input() user?: User;
  owned: boolean = true;
  list$ = new BehaviorSubject<Plant[]>([]);
  search$?: Subscription;
  smallView: boolean;

  filter: string = '';
  order: 'asc' | 'desc';
  sort: 'name' | 'date';

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
    private mt: MainToolbarService
  ) {
    this.smallView = (localStorage.getItem('LT_plantListView') === 'true');
    this.listView$ = new BehaviorSubject<boolean>(this.smallView);
    this.cardView$ = new BehaviorSubject<boolean>(!this.smallView);

    const order = localStorage.getItem('LT_plantListOrder');
    const sort = localStorage.getItem('LT_plantListSort');

    if ((order === 'asc') || (order === 'desc')) this.order = order;
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
  }

  ngOnInit(): void {
    if (this.user?.id) {
      this.owned = this.auth.isSameUser('id', this.user.id);
    }

    if (this.list) this.list$.next(this.list);
    else this.fetchPlants();

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
          icon: 'preview',
          tooltip: 'general.viewCards',
          click: () => { this.setSmallView(false) },
          selected: this.cardView$
        }
      ],
      [
        {
          icon: 'sort_by_alpha',
          tooltip: 'sort.alphabetically',
          click: () => { this.toggleSortByName() },
          selected: this.nameSelected$
        },
        {
          icon: 'history',
          tooltip: 'sort.date',
          click: () => { this.toggleSortByDate() },
          selected: this.dateSelected$
        },
      ],
    ])

    this.search$ = this.search.text$.subscribe((val: string) => {
      this.filter = val;
      this.fetchPlants()
    });
  }

  ngOnDestroy(): void {
    if (this.search$) this.search$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locationId']) {
      if (changes['locationId'].previousValue !== changes['locationId'].currentValue) {
        this.fetchPlants();
      }
    }
  }

  toggleSortByName() {
    if (this.sort !== 'name') { 
      this.sort = 'name';
      this.order = 'asc';
    }
    else this.toggleSortOrder();

    this.nameSelected$.next(true);
    this.dateSelected$.next(false);
    this.storeSortOptions();

    this.fetchPlants();
  }

  toggleSortByDate() {
    if (this.sort !== 'date'){
      this.sort = 'date';
      this.order = 'asc';
    }
    else this.toggleSortOrder();

    this.nameSelected$.next(false);
    this.dateSelected$.next(true);
    this.storeSortOptions();

    this.fetchPlants();
  }

  toggleSortOrder() {
    if (this.order === 'asc') this.order = 'desc';
    else this.order = 'asc';
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

  fetchPlants(options?: PlantGetConfig): void {
    this.list$.next([]);

    if (!options) {
      options = {
        filter: this.filter,
        sort: this.sort,
        order: this.order
      }
    }
    let obs: Observable<Plant[]>;

    if (this.locationId) {
      obs = this.locationService.getPlants(this.locationId, options);
    }
    else {
      const optionsForPS = {
        ...options,
        userId: this.user?.id,
        cover: true
      };

      obs = this.plantService.getMany(optionsForPS);
    }

    obs.subscribe((plants: Plant[]) => {
      this.list$.next(plants);
    });
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
        let list = this.list$.getValue();
        const index = list.findIndex((plant) => plant.id === updatedPlant.id);

        // we moved the plant, hence we remove it from the list
        if (updatedPlant.locationId !== this.locationId) {
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
