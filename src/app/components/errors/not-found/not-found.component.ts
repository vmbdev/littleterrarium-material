import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { finalize, interval, map, Observable, startWith, take } from 'rxjs';

@Component({
  selector: 'ltm-not-found',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  protected countdown$?: Observable<number>;

  ngOnInit() {
    this.countdown$ = interval(1000).pipe(
      take(6),
      startWith(0),
      map((val) => 5 - val),
      finalize(() => {
        this.router.navigateByUrl('/');
      }),
    );
  }
}
