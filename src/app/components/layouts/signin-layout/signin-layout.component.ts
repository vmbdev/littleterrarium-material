import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UnsignedToolbarComponent } from '@components/navigation/unsigned-toolbar/unsigned-toolbar.component';

@Component({
  selector: 'ltm-signin-layout',
  standalone: true,
  imports: [RouterModule, UnsignedToolbarComponent],
  templateUrl: './signin-layout.component.html',
  styleUrl: './signin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninLayoutComponent {}
