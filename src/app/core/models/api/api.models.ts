import { HttpContextToken } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { REQUIRES_API_KEY, CONTENT_TYPE_FILE } from "../../interceptors/http-tokens";
export type ApiServiceType = keyof typeof environment.SERVICES
export type ContextOptions =  "apiKey" | "contentTypeFile";

export const HTTP_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export interface CustomErrorResponse {
  message: string,
  status: string,
  timestamp: string
}

export interface BadRequestErrorResponse {
  status: string,
  message: string,
  timestamp: string,
  errors: {
    [key: string]: string[]
  }
}

const CONTEXT_OPTION_MAP: Record<ContextOptions, HttpContextToken<boolean>> = {
    apiKey: REQUIRES_API_KEY,
    contentTypeFile: CONTENT_TYPE_FILE,
}