import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'ltm-profile',
  standalone: true,
  imports: [CommonModule, TranslocoModule, ImagePathPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  user = input.required<User>();
  small = input(false, { transform: booleanAttribute });
  fullname = computed(() => {
    const user = this.user();

    return user.lastname
      ? `${user.firstname} ${user.lastname}`
      : user.firstname;
  });
}
