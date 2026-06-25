import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { AuthDetailsbyIdentifier, LogoutResponse, ResetPasswordResponse, } from '../../core/models/auth/auth-response';
import { ResetPasswordRequest } from '../../core/models/auth/auth.request';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  private apiService = inject(ApiService);
  private readonly SERVICE_PATH = environment.SERVICES.AUTH;
  readonly AUTH_ENDPOINTS = {
    RESET_PASSWORD:'${this.SERVICE_PATH}/api/v1/auth/reset-password',
    LOGOUT: '${this.SERVICE_PATH}/api/v1/auth/logout',
    AUTH_DETAILS: (identifier: string) => `${this.SERVICE_PATH}/api/v1/auth/${identifier}`
  }
  constructor() { }

  resetPasswrd(payload: ResetPasswordRequest):Observable<ResetPasswordResponse>{
    return this.apiService.post<ResetPasswordResponse, ResetPasswordRequest>(this.AUTH_ENDPOINTS.RESET_PASSWORD, payload)
  }

  logout():Observable<LogoutResponse>{
    return this.apiService.post<LogoutResponse>(this.AUTH_ENDPOINTS.LOGOUT);
  }

  validateUserSession(identifier:string):Observable<AuthDetailsbyIdentifier>{
    return this.apiService.get<AuthDetailsbyIdentifier>(this.AUTH_ENDPOINTS.AUTH_DETAILS(identifier))
  }
}
