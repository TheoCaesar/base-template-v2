export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
};
