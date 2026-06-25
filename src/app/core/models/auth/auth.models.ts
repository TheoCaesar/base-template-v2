import { AuthenticatedUser } from "./auth-response";

export type AuthenticatedUserDetails = Omit<AuthenticatedUser, 'token'>;
export type AuthToken = Pick<AuthenticatedUser, 'token'>;
