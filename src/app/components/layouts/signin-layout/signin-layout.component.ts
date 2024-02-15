import { Component } from '@angular/core';

import { SigninComponent } from '@components/user/signin/signin.component';

@Component({
  selector: 'ltm-signin-layout',
  standalone: true,
  imports: [SigninComponent],
  templateUrl: './signin-layout.component.html',
  styleUrl: './signin-layout.component.scss'
})
export class SigninLayoutComponent {}
