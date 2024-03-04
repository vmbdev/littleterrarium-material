import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { UserBoxComponent } from '@components/navigation/user-box/user-box.component';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomToolbarComponent {
  constructor(public readonly taskService: TaskService) {}
}
