import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'user-form-username',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './user-form-username.component.html',
  styleUrls: ['./user-form-username.component.scss']
})
export class UserFormUsernameComponent implements FormBaseComponent {
  @Input() currentUsername: string | null = '';
  public form = this.fb.group({ username: [''] });

  constructor (private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ username: this.currentUsername })
  }
}
