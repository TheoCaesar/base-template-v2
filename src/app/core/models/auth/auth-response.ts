export interface ResetPasswordResponse {
  message: string;
}

export interface LogoutResponse {
  status: boolean;
  message: string;
}


export interface AuthDetailsbyIdentifier {
  accessToken: string;
  expiresIn: string | number;
  refreshToken: string;
  firstLogin: boolean;
  temporalIdentifier: string;
}