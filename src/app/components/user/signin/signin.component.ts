import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  signinForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.signedIn$.subscribe((val: boolean) => {
      if (val) console.log('yes');
    })
  }

  submit() {
    if (!this.signinForm.valid) return;

    const { username, password } = this.signinForm.value;

    this.auth.signIn(username, password).subscribe({
      next: () => {
        console.log('signed')
      },
      error: (err: any) => {
        if (err.msg && (err.msg === 'USER_DATA_INCORRECT')) console.log('nope');
      }
    });
  }

}
