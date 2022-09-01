import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatroomService } from './services/chatroom.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateRoomResolver implements Resolve<boolean> {
  constructor(private service: ChatroomService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.service.getRoomById(route.paramMap.get('roomId'))
  }
}
