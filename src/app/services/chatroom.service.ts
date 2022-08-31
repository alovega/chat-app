import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {
  url = environment.socketUrl
  constructor(private http: HttpClient) { }
  initiateRoom(data):Observable<any>{
    return this.http.post(`${this.url}/room/initiate`, data).pipe(catchError(this.handleError))
  }

  getRooms():Observable<any>{
    return this.http.get(`${this.url}/room`).pipe(catchError(this.handleError)) 
  }

  getRoomById(id):Observable<any>{
    return this.http.get(`${this.url}/room/${id}`).pipe(catchError(this.handleError))
  }

  // public roomData(data){
  //   this.initiateRoom(data).subscribe(response => {
  //     if(response.success){
  //       this.payload$.next({"kevin":"hello"})
  //     }
  //   }, error => {this.handleError(error)}) 
  // }

  // getData(){
  //   return this.payload$.value
  // }
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
