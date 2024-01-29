import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { UserBoxComponent } from '@components/navigation/user-box/user-box.component';
import { TaskService } from '@services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ltm-bottom-toolbar',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor(public readonly taskService: TaskService) {}

  emitToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
