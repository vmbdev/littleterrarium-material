import {
  Component,
  Optional,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { skipWhile, catchError, EMPTY, finalize } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  UserFormBioComponent
} from '@components/user/forms/user-form-bio/user-form-bio.component';
import {
  UserFormEmailComponent
} from '@components/user/forms/user-form-email/user-form-email.component';
import {
  UserFormUsernameComponent
} from '@components/user/forms/user-form-username/user-form-username.component';
import {
  UserFormNameComponent
} from '@components/user/forms/user-form-name/user-form-name.component';
import {
  FormPrivacyComponent
} from '@components/form-privacy/form-privacy.component';
import { FormBaseComponent } from '@components/form-base/form-base.component';
import {
  WaitDialogComponent
} from '@components/dialogs/wait-dialog/wait-dialog.component';
import {
  FileUploaderComponent
} from '@components/file-uploader/file-uploader.component';
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
    TranslateModule,
    FileUploaderComponent,
    UserFormBioComponent,
    UserFormEmailComponent,
    UserFormUsernameComponent,
    UserFormNameComponent,
    FormPrivacyComponent,
    EditPageComponent
  ],
  templateUrl: './user-edit.component.html'
})
export class UserEditComponent {
  @ViewChildren('form') formComponents!: QueryList<FormBaseComponent>;
  @ViewChild('formEmail') emailComponent!: UserFormEmailComponent;
  @ViewChild('formUsername') usernameComponent!: UserFormUsernameComponent;

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
    private mt: MainToolbarService,
    private translate: TranslateService,
    private dialog: MatDialog,
    @Optional() private bottomSheetRef: MatBottomSheetRef,
  ) { }

  ngOnInit(): void {
    this.mt.hide();

    this.auth.checked$
    .pipe(
      skipWhile(val => val === false)
    ).subscribe();
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
    const user = this.auth.getUser();

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
        finalize(() => { wd.close() }),
        catchError((err: HttpErrorResponse) => {
          const error = err.error;

          if (error.msg === 'IMG_NOT_VALID') {
            this.errorHandler.push(this.translate.instant('errors.invalidImg'));
          }
          else if (error.msg === 'USER_FIELD_EXISTS') {
            if (error.errorData.field === 'username') {
              this.usernameComponent.form
                .get('username')
                ?.setErrors({ taken: true });
            }
            else if (error.errorData.field === 'email') {
              this.emailComponent.form
                .get('email')
                ?.setErrors({ taken: true });
            }
          }
  
          else if (error.msg === 'USER_FIELD_INVALID') {
            if (error.errorData.field === 'username') {
              this.usernameComponent.form
                .get('username')
                ?.setErrors({ invalid: true });
            }
            else if (error.errorData.field === 'email') {
              this.emailComponent.form
                .get('email')
                ?.setErrors({ invalid: true });
            }
          }

          return EMPTY;
        })
      ).subscribe((user: User) => {
        this.auth.updateUser(user);
        this.bottomSheetRef.dismiss();
      });
    }
  }
}
