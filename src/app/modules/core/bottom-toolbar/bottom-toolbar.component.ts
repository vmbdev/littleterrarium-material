import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { ImagePathService } from '@services/image-path.service';

@Component({
  selector: 'bottom-toolbar',
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.scss']
})
export class BottomToolbarComponent {
  @Output() toggleSidenav = new EventEmitter();

  constructor(
    public auth: AuthService,
    public imagePath: ImagePathService
  ) { }

  emitToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
