import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';

@Component({
  selector: 'ltm-profile',
  standalone: true,
  imports: [CommonModule, ImagePathPipe],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input() user?: User;
  @Input() small: boolean = false;
  private readonly userSj = new BehaviorSubject<User | null>(null);
  protected readonly user$ = this.userSj.asObservable();
  protected fullName: string = '';

  constructor(public readonly auth: AuthService) {}

  ngOnInit(): void {
    if (this.user) this.userSj.next(this.user);
    else this.auth.user$.subscribe(this.userSj);

    this.fullName = this.getFullName() ?? '';
  }

  getFullName(): string | null {
    const user = this.userSj.getValue();

    if (user) {
      const firstname = user.firstname ? user.firstname + ' ' : '';

      return `${firstname}${user.lastname}`;
    } else return null;
  }
}
