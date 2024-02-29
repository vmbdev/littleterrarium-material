import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  QueryList,
  ViewChild,
  ViewChildren,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { UserFormBioComponent } from '@components/user/forms/user-form-bio/user-form-bio.component';
import { UserFormEmailComponent } from '@components/user/forms/user-form-email/user-form-email.component';
import { UserFormUsernameComponent } from '@components/user/forms/user-form-username/user-form-username.component';
import { UserFormNameComponent } from '@components/user/forms/user-form-name/user-form-name.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';
import { FileUploaderComponent } from '@components/file-uploader/file-uploader.component';
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { MainToolbarService } from '@services/main-toolbar.service';
import { ApiService } from '@services/api.service';
import { AuthService } from '@services/auth.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { User } from '@models/user.model';

@Component({
  selector: 'ltm-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    TranslocoModule,
    FileUploaderComponent,
    UserFormBioComponent,
    UserFormEmailComponent,
    UserFormUsernameComponent,
    UserFormNameComponent,
    FormPrivacyComponent,
    EditPageComponent,
  ],
  templateUrl: './user-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent {
  // FIXME: remove this
  @ViewChild('fileUploader') fileUploaderComponent!: FileUploaderComponent;

  protected readonly form: FormGroup = this.fb.group({
    username: new FormControl<string>('', Validators.required),
    firstname: new FormControl<string | null>(''),
    lastname: new FormControl<string | null>(''),
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern(/^\S+@\S+\.\S+$/i),
      ],
    ],
    bio: new FormControl<string | null>(''),
    avatarFile: [],
    public: new FormControl<boolean>(true),
  });
  protected user$?: Observable<User | null>;
  private avatar?: File;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly auth: AuthService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly mt: MainToolbarService,
    private readonly translate: TranslocoService,
    private readonly dialog: MatDialog,
    @Optional() private readonly bottomSheetRef: MatBottomSheetRef,
  ) {}

  ngOnInit(): void {
    this.mt.hide();

    this.user$ = this.auth.user$.pipe(
      tap((user: User | null) => {
        if (user) {
          this.form.patchValue({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            bio: user.bio,
            public: user.public,
          });
        }
      }),
    );
  }

  openWaitDialog() {
    return this.dialog.open(WaitDialogComponent, {
      disableClose: true,
      data: {
        message: this.translate.translate('general.loading'),
        progressBar: false,
      },
    });
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.avatar = files[0];
    }
  }

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }
    const user = {
      ...this.form.value,
      avatarFile: this.avatar,
    } as User;
    const wd = this.openWaitDialog();

    if (user) {
      const removePicture =
        !!this.fileUploaderComponent.form.get('remove')?.value;

      this.api
        .updateUser(user, { removeAvatar: removePicture })
        .pipe(
          finalize(() => {
            wd.close();
          }),
          catchError((err: HttpErrorResponse) => {
            const error = err.error;

            if (error.msg === 'IMG_NOT_VALID') {
              this.errorHandler.push(
                this.translate.translate('errors.invalidImg'),
              );
            } else if (error.msg === 'USER_FIELD_EXISTS') {
              if (error.errorData.field === 'username') {
                this.form.get('username')?.setErrors({ taken: true });
              } else if (error.errorData.field === 'email') {
                this.form.get('email')?.setErrors({ taken: true });
              }
            } else if (error.msg === 'USER_FIELD_INVALID') {
              if (error.errorData.field === 'username') {
                this.form.get('username')?.setErrors({ invalid: true });
              } else if (error.errorData.field === 'email') {
                this.form.get('email')?.setErrors({ invalid: true });
              }
            }

            return EMPTY;
          }),
        )
        .subscribe((user: User) => {
          this.auth.updateUser(user);
          this.bottomSheetRef.dismiss();
        });
    }
  }
}
