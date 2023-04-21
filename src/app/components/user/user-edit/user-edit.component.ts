import { Component, Optional, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { skipWhile, catchError, EMPTY, finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { User } from '@models/user.model';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormBioComponent } from '@components/user/forms/user-form-bio/user-form-bio.component';
import { UserFormEmailComponent } from '@components/user/forms/user-form-email/user-form-email.component';
import { UserFormUsernameComponent } from '@components/user/forms/user-form-username/user-form-username.component';
import { UserFormNameComponent } from '@components/user/forms/user-form-name/user-form-name.component';
import { UserFormPrivacyComponent } from '@components/user/forms/user-form-privacy/user-form-privacy.component';
import { FormBaseComponent } from '@components/form-base/form-base.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    TranslateModule,
    FileUploaderComponent,
    UserFormBioComponent,
    UserFormEmailComponent,
    UserFormUsernameComponent,
    UserFormNameComponent,
    UserFormPrivacyComponent
  ]
})
export class UserEditComponent {
  @ViewChildren('form') formComponents!: QueryList<FormBaseComponent>;

  userForm: FormGroup = this.fb.group({
    username: new FormControl<string>('', Validators.required),
    firstname: new FormControl<string | null>(''),
    lastname: new FormControl<string | null>(''),
    email: ['', [Validators.required, Validators.email]],
    bio: new FormControl<string | null>(''),
    avatarFile: [],
    public: new FormControl<boolean>(true),
  });
  avatar?: File;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private translate: TranslateService,
    private dialog: MatDialog,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
  ) { }

  ngOnInit(): void {
    this.auth.checked$.pipe(
      skipWhile(val => val === false)
    ).subscribe(() => {
      const user = this.auth.user$.getValue();

      if (user) {
        this.userForm.patchValue({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          bio: user.bio,
          public: user.public
        });
      }
    });
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.instant('general.loading'),
        progressBar: false,
      },
    });
  }

  getUserFromForm(): User | null {
    const user = this.auth.user$.getValue();

    if (user) {
      return {
        ...Object.assign(
          {},
          ...(this.formComponents.toArray().map(comp => comp.form.value))
        ),
        id: user.id,
        avatarFile: this.avatar
      } as User;
    }
    else return null;
  }

  checkFormValidity(): boolean {
    return this.formComponents.toArray().every((comp) => comp.form.valid);
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.avatar = files[0]
    }
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.instant('general.formErrors'));
      return;
    }
    const user = this.getUserFromForm();
    const wd = this.openWaitDialog();

    if (user) {
      this.api.editUser(user).pipe(
        finalize(() => {
          wd.close();
  
          if (this.bottomSheetRef) {
            this.bottomSheetRef.dismiss();
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.error?.msg === 'IMG_NOT_VALID') this.errorHandler.push(this.translate.instant('errors.invalidImg'));

          return EMPTY;
        })
      ).subscribe((user: User) => {
        this.auth.updateUser(user);
        this.bottomSheetRef.dismiss();
      });
    }
  }
}
