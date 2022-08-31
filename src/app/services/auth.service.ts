import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.socketUrl
  constructor(private http: HttpClient) { }
  isLoggedIn() {
    const token = sessionStorage.getItem('token'); // get token from local storage
    if(token){
      const payload = atob(token.split('.')[1]); // decode payload of token
      const parsedPayload = JSON.parse(payload); // convert payload into an Object

      return parsedPayload.exp > Date.now() / 1000; // check if token is expired
    }
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.url}/login`, data).pipe(catchError(this.handleError))
  }

  verification(data: any): Observable<any>{
    return this.http.post(`${this.url}/verify`, data).pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError((error) => new Error(error));
  }
}