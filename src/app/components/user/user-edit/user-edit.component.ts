import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { EditPageComponent } from '@components/edit-page/edit-page.component';
import { SettingsCardComponent } from '@components/settings-card/settings-card.component';
import { MainToolbarService } from '@services/main-toolbar/main-toolbar.service';
import { ApiService } from '@services/api/api.service';
import { AuthService } from '@services/auth/auth.service';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';
import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';
import { ImageSelectorComponent } from '@components/image-selector/image-selector.component';

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
    UserFormBioComponent,
    UserFormEmailComponent,
    UserFormUsernameComponent,
    UserFormNameComponent,
    FormPrivacyComponent,
    EditPageComponent,
    SettingsCardComponent,
    ImageSelectorComponent,
    ImagePathPipe,
  ],
  templateUrl: './user-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly mt = inject(MainToolbarService);
  private readonly translate = inject(TranslocoService);
  private readonly dialog = inject(MatDialog);
  private readonly bottomSheetRef = inject(MatBottomSheetRef, {
    optional: true,
  });

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
    avatarFile: new FormControl<File | null>(null),
    public: new FormControl<boolean>(true),
  });
  protected user$?: Observable<User | null>;
  protected newAvatar?: string;
  protected removeAvatar: boolean = false;

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

  selectImage(file: File | null) {
    if (file) {
      this.form.patchValue({
        avatarFile: file,
      });

      this.newAvatar = URL.createObjectURL(file);
      this.removeAvatar = false;
    } else {
      this.form.patchValue({
        avatarFile: null,
      });

      if (this.newAvatar) {
        URL.revokeObjectURL(this.newAvatar);
        this.newAvatar = undefined;
      }

      this.removeAvatar = true;
    }
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

  setRemoveAvatar() {
    this.removeAvatar = true;
  }

  submit(): void {
    if (!this.form.valid) {
      this.errorHandler.push(this.translate.translate('general.formErrors'));
      return;
    }
    const user = this.form.value as User;
    const wd = this.openWaitDialog();

    if (user) {
      this.api
        .updateUser(user, { removeAvatar: this.removeAvatar })
        .pipe(
          finalize(() => {
            wd.close();
          }),
          catchError((err: HttpErrorResponse) => {
            const { msg } = err.error;
            const { field } = err.error.errorData;

            switch (msg) {
              case 'IMG_NOT_VALID': {
                this.errorHandler.push(
                  this.translate.translate('errors.invalidImg'),
                );
                break;
              }
              case 'USER_FIELD_EXISTS': {
                if (field === 'username') {
                  this.form.get('username')?.setErrors({ taken: true });
                } else if (field === 'email') {
                  this.form.get('email')?.setErrors({ taken: true });
                }

                break;
              }
              case 'USER_FIELD_INVALID': {
                if (field === 'username') {
                  this.form.get('username')?.setErrors({ invalid: true });
                } else if (field === 'email') {
                  this.form.get('email')?.setErrors({ invalid: true });
                }

                break;
              }
            }

            return EMPTY;
          }),
        )
        .subscribe((user: User) => {
          this.auth.updateUser(user);
          this.bottomSheetRef?.dismiss();
        });
    }
  }
}
