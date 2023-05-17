import { Component } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';

@Component({
  selector: 'user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss']
})
export class UserBoxComponent {
  constructor(
    public auth: AuthService,
    public imagePath: ImagePathService
  ) {}
}
