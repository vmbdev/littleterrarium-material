import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@services/auth.service';
import { WaitDialogComponent } from '@components/dialogs/wait-dialog/wait-dialog.component';

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
    TranslateModule,
    WaitDialogComponent
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
  authInvalid: boolean = false;
  processingSignUp: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.signedIn$.subscribe((val: boolean) => {
      if (val) this.router.navigateByUrl('/');
    })
  }

  submit() {
    if (!this.signinForm.valid) return;

    const { username, password } = this.signinForm.value;
    this.processingSignUp = true;
    this.authInvalid = false;

    this.auth.signIn(username, password).pipe(
      finalize(() => {
        this.processingSignUp = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      error: (err: any) => {
        if (err.msg && (err.msg === 'USER_DATA_INCORRECT')) {
          this.authInvalid = true;
        }
      }
    });
  }

}
