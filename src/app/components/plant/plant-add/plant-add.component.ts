import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { PlantFormNameComponent } from '@components/plant/plant-form-name/plant-form-name.component';
import { PlantFormSpecieComponent } from '@components/plant/plant-form-specie/plant-form-specie.component';
import { PlantFormPrivacyComponent } from '@components/plant/plant-form-privacy/plant-form-privacy.component';
import { PlantService } from '@services/plant.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { finalize } from 'rxjs';
import { Plant } from '@models/plant.model';
import { Location } from '@models/location.model';
import { HttpEventType } from '@angular/common/http';
import { LocationService } from '@services/location.service';

@Component({
  selector: 'plant-add',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    MatDialogModule,
    TranslateModule,
    StepperNavigationComponent,
    FileUploaderComponent,

    PlantFormNameComponent,
    PlantFormPrivacyComponent,
    PlantFormSpecieComponent
  ],
  templateUrl: './plant-add.component.html',
  styleUrls: ['./plant-add.component.scss']
})
export class PlantAddComponent {
  @ViewChild(PlantFormNameComponent) nameComponent!: PlantFormNameComponent;
  @ViewChild(PlantFormSpecieComponent) specieComponent!: PlantFormSpecieComponent;
  @ViewChild(PlantFormPrivacyComponent) privacyComponent!: PlantFormPrivacyComponent;

  locationId?: number;
  pictures: File[] = [];
  uploadProgress: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private plantService: PlantService,
    private locationService: LocationService,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.locationId = +this.route.snapshot.params['locationId'];

    if (this.locationId) {
      this.locationService.get(this.locationId).subscribe({
        error: () => {
          this.errorHandler.push(this.translate.instant('plant-add.location'));
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  fileChange(files: File[]) {
    this.pictures = files;
  }

  // TODO: uploading files progress bar
  openUploadDialog(): MatDialogRef<WaitDialogComponent, any>  {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('progress-bar.uploading'),
        progressBar: true,
        progressValue: 0,
        finalMessage: this.translate.instant('general.afterUpload')
      },
    });
  }

  // TODO: refactor?
  checkFormValidity(): boolean {
    const forms = [
      this.nameComponent.form,
      this.specieComponent.form,
      this.privacyComponent.form,
    ];

    return forms.every((form) => form.valid);
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }
    
    const plant: Plant = {
      ...this.nameComponent.form.value,
      ...this.specieComponent.form.value,
      ...this.privacyComponent.form.value,
      locationId: this.locationId
    } as Plant;
    
    const ud = this.openUploadDialog();

    this.plantService.create(plant, this.pictures).pipe(
      finalize(() => { ud.close() })
    ).subscribe({
      next: (event) => {
        if (event?.msg === 'PLANT_CREATED') {
          this.router.navigate(['/plant', event.data.plant.id], { replaceUrl: true });
        }
        else {
          switch (event.type) {
            case HttpEventType.UploadProgress: {
              const eventTotal = event.total ? event.total : 0;
              ud.componentInstance.data.progressValue = Math.round(event.loaded / eventTotal * 100);
              break;
            }
            case HttpEventType.Response: {
              if (event.body.msg === 'PHOTOS_CREATED') {
                this.uploadProgress = 0;
              }

              this.router.navigate(['/plant', event.body.data.plantId], { replaceUrl: true });
              break;
            }
          }
        }
      },
      error: () => {
        this.errorHandler.push(this.translate.instant('plant-add.create'));
      }
    });

  }
}
