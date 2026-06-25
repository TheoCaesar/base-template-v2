import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContextOptions } from '../../core/models/api/api.models';
import { REQUIRES_API_KEY, CONTENT_TYPE_FILE } from '../../core/interceptors/http-tokens';
export const CONTEXT_OPTION_MAP: Record<ContextOptions, HttpContextToken<boolean>> = {
  apiKey: REQUIRES_API_KEY,
  contentTypeFile: CONTENT_TYPE_FILE,
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }
  buildContext(options: ContextOptions[]) {
    let context = new HttpContext();
    for (let option of options) {
      context = context.set(CONTEXT_OPTION_MAP[option], true)
    }
    return context;
  };
  get<TResponse>(url: string, context?:HttpContext) {
    return this.http.get<TResponse>(url, {context});
  }

  post<TResponse, TRequest = unknown>(url: string, body?: TRequest, context?:HttpContext) {
    console.dir(context)
    return this.http.post<TResponse>(url, body, {context});
  }

  put<TResponse, TRequest>(url: string, body: TRequest, context?:HttpContext) {
    return this.http.put<TResponse>(url, body, {context});
  }

  delete<TResponse>(url: string, context?:HttpContext) {
    return this.http.delete<TResponse>(url, {context})
  }

  uploadFile<TResponse>(url: string, file: File) {
    return this.http.put<TResponse>(url, file)
  }

}