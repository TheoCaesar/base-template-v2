import { HttpContextToken } from "@angular/common/http";
import { ApiServiceType } from "../models/api/api.models";


export const REQUIRES_API_KEY = new HttpContextToken<boolean>(() => false);
// export const REQUIRES_AUTH = new HttpContextToken<boolean>(() => false);
// export const REQUIRES_BUSINESS_ID = new HttpContextToken<boolean>(() => false);
export const CONTENT_TYPE_FILE = new HttpContextToken<boolean>(() => false);
export const API_SERVICE = new HttpContextToken<ApiServiceType | null>(()=>null)