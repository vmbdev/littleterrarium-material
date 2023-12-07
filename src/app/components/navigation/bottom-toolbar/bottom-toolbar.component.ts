import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import {
  UserBoxComponent
} from '@components/navigation/user-box/user-box.component';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';
import { TaskService } from '@services/task.service';

@Component({
  selector: 'ltm-bottom-toolbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatBadgeModule,
    MatButtonModule,
    RouterModule,
    UserBoxComponent,
  ],
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.scss'],
})
export class BottomToolbarComponent {
  @Output() toggleSidenav = new EventEmitter();

  constructor(
    public auth: AuthService,
    public imagePath: ImagePathService,
    public taskService: TaskService
  ) {}

  emitToggleSidenav() {
    this.toggleSidenav.emit();
  }

  getTaskCount(): number | null {
    const count = this.taskService.getCount();

    return count > 0 ? count : null;
  }
}
