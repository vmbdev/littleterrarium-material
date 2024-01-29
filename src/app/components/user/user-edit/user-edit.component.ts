import {
  Component,
  Optional,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { skipWhile, catchError, EMPTY, finalize } from 'rxjs';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';

import { UserFormBioComponent } from '@components/user/forms/user-form-bio/user-form-bio.component';
import { UserFormEmailComponent } from '@components/user/forms/user-form-email/user-form-email.component';
import { UserFormUsernameComponent } from '@components/user/forms/user-form-username/user-form-username.component';
import { UserFormNameComponent } from '@components/user/forms/user-form-name/user-form-name.component';
import { FormPrivacyComponent } from '@components/form-privacy/form-privacy.component';
import { FormBaseComponent } from '@components/form-base/form-base.component';
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
})
export class UserEditComponent {
  @ViewChildren('form') formComponents!: QueryList<FormBaseComponent>;
  @ViewChild('formEmail') emailComponent!: UserFormEmailComponent;
  @ViewChild('formUsername') usernameComponent!: UserFormUsernameComponent;
  @ViewChild('fileUploader') fileUploaderComponent!: FileUploaderComponent;

  protected readonly userForm: FormGroup = this.fb.group({
    username: new FormControl<string>('', Validators.required),
    firstname: new FormControl<string | null>(''),
    lastname: new FormControl<string | null>(''),
    email: ['', [Validators.required, Validators.email]],
    bio: new FormControl<string | null>(''),
    avatarFile: [],
    public: new FormControl<boolean>(true),
  });
  private avatar?: File;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    public readonly auth: AuthService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly mt: MainToolbarService,
    private readonly translate: TranslocoService,
    private readonly dialog: MatDialog,
    @Optional() private readonly bottomSheetRef: MatBottomSheetRef,
  ) {}

  ngOnInit(): void {
    this.mt.hide();

    this.auth.checked$.pipe(skipWhile((val) => val === false)).subscribe();
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

  getUserFromForm(): User | null {
    const user = this.auth.getUser();

    if (user) {
      return {
        ...Object.assign(
          {},
          ...this.formComponents.toArray().map((comp) => comp.form.value),
        ),
        id: user.id,
        avatarFile: this.avatar,
      } as User;
    } else return null;
  }

  checkFormValidity(): boolean {
    return this.formComponents.toArray().every((comp) => comp.form.valid);
  }

  fileChange(files: File[]) {
    if (files.length > 0) {
      this.avatar = files[0];
    }
  }

  submit(): void {
    if (!this.checkFormValidity()) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }
    const user = this.getUserFromForm();
    const wd = this.openWaitDialog();

    if (user) {
      const removePicture =
        !!this.fileUploaderComponent.form.get('remove')?.value;

      this.api
        .editUser(user, { removeAvatar: removePicture })
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
                this.usernameComponent.form
                  .get('username')
                  ?.setErrors({ taken: true });
              } else if (error.errorData.field === 'email') {
                this.emailComponent.form
                  .get('email')
                  ?.setErrors({ taken: true });
              }
            } else if (error.msg === 'USER_FIELD_INVALID') {
              if (error.errorData.field === 'username') {
                this.usernameComponent.form
                  .get('username')
                  ?.setErrors({ invalid: true });
              } else if (error.errorData.field === 'email') {
                this.emailComponent.form
                  .get('email')
                  ?.setErrors({ invalid: true });
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
