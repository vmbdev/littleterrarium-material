import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ImagePathPipe } from '@pipes/image-path/image-path.pipe';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'ltm-user-box',
  standalone: true,
  imports: [CommonModule, MatIconModule, ImagePathPipe],
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBoxComponent {
  constructor(public readonly auth: AuthService) {}
}
