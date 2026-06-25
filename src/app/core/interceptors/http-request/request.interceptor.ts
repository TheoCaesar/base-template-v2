import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_SERVICE, REQUIRES_API_KEY, CONTENT_TYPE_FILE } from '../http-tokens';
import { ApiServiceType } from '../../models/api/api.models';
import { inject } from '@angular/core';
import { UserService } from '../../services/user.service';

const appendDeployedServicesURL = false;

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const apiKey = inject(UserService).authToken()?.token;
  let request = req;
  if (!req.url.startsWith('http')) {
    // set deployed services url-segment
    const apiService: ApiServiceType | null = req.context.get(API_SERVICE)
    const apiServiceURLSegment = (apiService) ? environment.SERVICES[apiService] : '';

    request = request.clone({
      url: `${environment.API_HOST}${(appendDeployedServicesURL) ? apiServiceURLSegment : ''}${req.url}` 
    })
  }
  let headers = request.headers;

  //api token header
  if (request.context.get(REQUIRES_API_KEY) && apiKey) {
    headers = headers.set('api-token', apiKey)
  }

  //content-type header
  if (request.context.get(CONTENT_TYPE_FILE)) {
    headers = headers.set('Content-Type', 'multipart/formdata');
  }

  request = request.clone({ headers })
  return next(request);
};
