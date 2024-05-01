import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

import { ImageSelectorComponent } from '@components/image-selector/image-selector.component';
import { AuthService } from '@services/auth/auth.service';
import { ApiService } from '@services/api/api.service';
import { ErrorHandlerService } from '@services/error-handler/error-handler.service';
import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'ltm-profile',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ImageSelectorComponent,
    ImagePathPipe,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly translate = inject(TranslocoService);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly errorHandler = inject(ErrorHandlerService);

  user = input.required<User>();
  sameUser = computed(() => this.auth.isSameUser('id', this.user().id));
  fullname = computed(() => {
    const user = this.user();

    return user.lastname
      ? `${user.firstname} ${user.lastname}`
      : user.firstname;
  });

  protected newAvatar?: string;

  selectImage(file: File | null) {
    const avatarFile = file;

    if (file) {
      this.newAvatar = URL.createObjectURL(file);
    } else if (this.newAvatar) {
      URL.revokeObjectURL(this.newAvatar);
      this.newAvatar = undefined;
    }

    this.updateAvatar(avatarFile);
  }

  updateAvatar(file: File | null): void {
    const user = this.auth.getUser();

    if (!user) return;
    if (file) user.avatarFile = file;

    if (user) {
      this.api
        .updateUser(user, { removeAvatar: file === null })
        .pipe(
          catchError((err: HttpErrorResponse) => {
            const { msg } = err.error;

            if (msg === 'IMG_NOT_VALID') {
              this.errorHandler.push(
                this.translate.translate('errors.invalidImg'),
              );
            }

            return EMPTY;
          }),
        )
        .subscribe((user: User) => {
          this.auth.updateUser(user);
        });
    }
  }
}
