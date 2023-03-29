import { Component, Input, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Light, Location } from '@models/location.model';
import { StepperNavigationComponent } from '@components/stepper-navigation/stepper-navigation.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { LocationService } from '@services/location.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '@services/api.service';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ErrorHandlerService } from '@services/error-handler.service';
;

@Component({
  selector: 'location-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    TranslateModule,
    StepperNavigationComponent,
    FileUploaderComponent
  ],
  templateUrl: './location-add-edit.component.html',
  styleUrls: ['./location-add-edit.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class LocationAddEditComponent {
  formName = this.fb.group({ name: ['', Validators.required] });
  formLight = this.fb.group({ light: ['FULLSUN', Validators.required] });
  formPublic = this.fb.group({ public: [true] });

  lightOptions = Light;
  createNew: boolean = false;
  picture?: File;
  removePicture: boolean = false;

  location?: Location;
  
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private api: ApiService,
    public locationService: LocationService,
    private errorHandler: ErrorHandlerService,
    private bottomSheetRef: MatBottomSheetRef,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private editLocation: { id: number }
  ) { }

  ngOnInit(): void {
    this.createNew = (!this.editLocation);

    if (!this.createNew && this.editLocation.id) {
      this.api.getLocation(this.editLocation.id).subscribe((location: Location) => {
        this.location = location;
      });
    }
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.picture = files[0]
    }
  }

  submit(): void {
    const data: Location = {
      ...this.formName.value,
      ...this.formLight.value,
      ...this.formPublic.value,
      pictureFile: this.picture
    } as Location;

    let insert: Observable<any> | undefined;

    if (this.createNew) insert = this.api.createLocation(data);
    else if (this.editLocation.id) {
      data.id = this.editLocation.id;
      insert = this.api.updateLocation(data, this.removePicture);
    }

    // this.disableNavigation = true;

    if (insert) {
      insert.pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

          return EMPTY;
        }),
        finalize(() => {
          // this.disableNavigation = false;
          if (this.editLocation) this.bottomSheetRef.dismiss(this.location);
        })
      ).subscribe((res: any) => {
        if (this.editLocation) this.location = res.data.location;
        // if (res.msg === 'LOCATION_CREATED') this.router.navigate([`location/${res.data.location.id}`]);
        // else if (res.msg === 'LOCATION_UPDATED') this.router.navigate([`location/${data.id}`]);
      });
    }
  }
}
