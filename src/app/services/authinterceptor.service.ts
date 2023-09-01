import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthinterceptorService implements HttpInterceptor {
  tokenL;
  token: string = '';
  constructor(private router: Router, private as: AuthService) {
    // this.tokenL = localStorage.getItem('usertoken');
    this.as.currentUser.subscribe((user) => {
      this.tokenL = user.token;
    });
    // this.as.token.subscribe(async (res) => (this.token = await res));
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.tokenL !== null) {
      req = req.clone({
        setHeaders: { Authorization: `Token ${this.tokenL}` },
      });
    }

    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
        return throwError(() => console.log('Fehler', err));
      })
    );
  }
}
