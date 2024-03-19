import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'ltm-user-box',
  standalone: true,
  imports: [CommonModule, MatIconModule, ImagePathPipe],
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBoxComponent {
  protected readonly auth = inject(AuthService);
}
