import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup,
  FormControlStatus,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, distinctUntilChanged, skipWhile, tap } from 'rxjs';
import { TranslocoModule } from '@ngneat/transloco';

import { FullWidthDirective } from '@directives/full-width.directive';

@Component({
  selector: 'ltm-user-form-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
    FullWidthDirective,
  ],
  templateUrl: './user-form-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormEmailComponent {
  private readonly rootFormGroup = inject(FormGroupDirective);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected formStatusDetector$?: Observable<FormControlStatus>;
  protected $form?: WritableSignal<FormGroup>;
  protected readonly $errorTaken = signal<boolean>(false);
  protected readonly $errorInvalid = signal<boolean>(false);

  ngOnInit() {
    this.$form = signal(this.rootFormGroup.control);
    this.rootFormGroup.control.statusChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged(),
      skipWhile((status) => status === 'VALID'),
      tap(() => {
        if (this.checkForError('invalid')) this.$errorInvalid.set(true);
        else if (this.checkForError('taken')) this.$errorTaken.set(true);
        this.cdr.markForCheck();
      }),
    )
    .subscribe()
  }

  checkForError(error: string): boolean {
    if (this.rootFormGroup.control) {
      const errors = this.rootFormGroup.control.get('email')?.errors;
      return errors && errors[error];
    }

    return false;
  }
}
