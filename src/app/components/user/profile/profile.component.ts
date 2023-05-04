import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';
import { User } from '@models/user.model';

@Component({
  selector: 'profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  @Input() user?: User;
  @Input() small: boolean = false;
  user$ = new BehaviorSubject<User | null>(null);

  constructor(
    public auth: AuthService,
    private imagePath: ImagePathService
  ) {}

  ngOnInit(): void {
    if (this.user) this.user$.next(this.user);
    else this.auth.user$.subscribe(this.user$);
  }

  getAvatar(): string | null {
    const user = this.user$.getValue();

    return this.imagePath.get(user?.avatar, 'thumb');
  }

  getFullName(): string | null {
    const user = this.user$.getValue();
    
    if (user) {
      return `${user.firstname ? user.firstname + ' ' : ''}${user.lastname ? user.lastname + ' ': ''}`;
    }
    else return null;
  }
}
