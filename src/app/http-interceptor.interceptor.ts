import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = sessionStorage.getItem('token')
    request = request.clone({
      headers: request.headers.set('Content-Type','application/json',)
    })
    if(token){
      request = request.clone({
        headers: request.headers.set('Authorization',`token ${token}`)
      })
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if(err instanceof HttpErrorResponse){
          if (err.status == 401){
            this.router.navigate(['login'])
          }
        }
        return throwError(err)
      })
    );
  }
}
