import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(
    public auth: AuthService,
    private imagePath: ImagePathService
  ) {}

  getAvatar(): string | null {
    const user = this.auth.user$.getValue();

    return this.imagePath.get(user?.avatar, 'thumb');
  }

  getFullName(): string | null {
    const user = this.auth.user$.getValue();
    
    if (user) {
      return `${user.firstname ? user.firstname + ' ' : ''}${user.lastname ? user.lastname + ' ': ''}`;
    }
    else return null;
  }
}
