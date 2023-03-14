import { ErrorHandler, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {
  list$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() {
  }

  handleError(error: any) {
    
  }

  push(error: string) {
      this.list$.next(error);
  }
}
