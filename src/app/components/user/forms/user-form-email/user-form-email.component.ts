import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { FormBaseComponent } from '@components/form-base/form-base.component';

@Component({
  selector: 'user-form-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './user-form-email.component.html',
  styleUrls: ['./user-form-email.component.scss']
})
export class UserFormEmailComponent implements FormBaseComponent {
  @Input() currentEmail: string | null = '';
  public form = this.fb.group({ email: [''] });

  constructor (private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form.patchValue({ email: this.currentEmail })
  }
}
