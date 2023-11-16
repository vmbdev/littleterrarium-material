import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';

@Component({
  selector: 'ltm-user-box',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent {
  constructor(
    public auth: AuthService,
    public imagePath: ImagePathService
  ) {}
}
