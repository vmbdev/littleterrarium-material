import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize, Observable } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ApiService } from '@services/api.service';
import { ImagePathService } from '@services/image-path.service';
import { Location } from '@models/location.model';
import { ImagePath } from '@models/image-path.model';
import { FabComponent } from '@components/fab/fab.component';
import { LocationService } from '@services/location.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { ConfirmDialogComponent } from '@components/dialogs/confirm-dialog/confirm-dialog.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';


@Component({
  selector: 'location-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatRippleModule,
    MatDialogModule,
    TranslateModule,
    FabComponent,
    WaitDialogComponent
  ],
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss']
})
export class LocationListComponent {
  @Input() userId?: number;
  @Input() owned: boolean = true;
  locations$?: Observable<Location[]>;
  loading: boolean = false;

  constructor(
    private apiService: ApiService,
    private locationService: LocationService,
    private imagePath: ImagePathService,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getLocationList();
  }

  getLocationList() {
    this.loading = true;

    const options = {
      plantCount: true,
      userId: this.userId ? this.userId : null
    }

    this.locations$ = this.apiService.getLocationList(options).pipe(
      finalize(() => { this.loading = false })
    );
  }

  selectLocation(id: number) {
    this.router.navigate(['location', id]);
  }

  getHeaderPic(images: ImagePath): string | null {
    return this.imagePath.get(images, 'thumb');
  }

  openDialog(name: string, id: number) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: name,
        question: this.translate.instant('location.remove'),
        accept: () => this.delete(id)
      },
    });
  }

  delete(id: number) {
    this.locationService.delete(id).subscribe({
      next: (res) => {
        if (res.msg === 'LOCATION_REMOVED') this.getLocationList();
      },
      error: (err) => {
        if (err.msg === 'LOCATION_NOT_VALID') {
          this.translate.get('location.invalid').subscribe((res: string) => {
            this.errorHandler.push(res);
          })
        }
      }
    });

  }
}
