import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { CustomErrorResponse, HTTP_ERROR_CODES } from '../../models/api/api.models';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService)
  return next(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const customError:CustomErrorResponse = err.error;

        if (err.status !==  HTTP_ERROR_CODES.BAD_REQUEST) {
          toastr.error(customError.message, customError.status)
          if (req.url.includes('auth/resend-otp') && err.status == 429)
            throw err
        }
        throw err.error;
      })
    );
};
