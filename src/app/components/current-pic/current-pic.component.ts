import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'ltm-current-pic',
  standalone: true,
  imports: [
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './current-pic.component.html',
  styleUrl: './current-pic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentPicComponent {
  pic = input.required<string | null>();
  remove = output<boolean>();

  removePic(): void {
    this.remove.emit(true);
  }
}
