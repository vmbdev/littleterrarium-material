import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

import { AuthService } from '@services/auth.service';
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
  @Input({ required: true }) user!: User;
  @Input() small: boolean = false;
  protected fullName: string = '';

  constructor(public readonly auth: AuthService) {}

  ngOnInit(): void {
    this.fullName = this.getFullName(this.user);
  }

  getFullName(user: User): string {
    const firstname = user.firstname ? user.firstname + ' ' : '';

    return `${firstname}${user.lastname}`;
  }
}
