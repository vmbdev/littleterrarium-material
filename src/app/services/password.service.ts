import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@services/api.service';
import { BackendResponse } from '@models/backend-response.model';
import { PasswordRequirements, User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private readonly api = inject(ApiService);

  forgotPassword(userRef: string): Observable<any> {
    return this.api.forgotPassword(userRef);
  }

  recoverPassword(
    token: string,
    password: string,
    userId: number
  ): Observable<any> {
    return this.api.recoverPassword(token, password, userId);
  }

  verifyToken(token: string, userId: number): Observable<any> {
    return this.api.verifyToken(token, userId);
  }

  checkPassword(password: string): Observable<BackendResponse> {
    return this.api.checkPassword(password);
  }

  getPasswordRequirements(): Observable<PasswordRequirements> {
    return this.api.getPasswordRequirements();
  }

  changePassword(password: string, userId: number): Observable<User> {
    const user = {
      id: userId,
      password
    } as User;

    return this.api.updateUser(user);
  }
}
