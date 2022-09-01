import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Observer, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket = io.io(environment.socketUrl, {transports: ['websocket'], upgrade: false})
  messages = new Subject()
  rooms = new Subject()
  constructor() { }

  // emit event
  userSocket(data){
    console.log("socket", data)
    this.socket.emit('initiateSocket', data);
  }

  onOnlineUsers(){
    return new Observable((observer: Observer<any>)=> {
      this.socket.on('onlineUsers', data => {
        observer.next(data)
      })
    })
  }

  getOnlineUsers(){
    this.socket.emit('online')
  }

  privateMessage(data){
    this.socket.emit('privateMessage', data)
  }

  roomMessage(data){
    this.socket.emit('roomMessage', data)
  }

  getMessage(){
    return new Observable((observer: Observer<any>) => {
      this.socket.on('private message', (data) => {
        observer.next(data)
      })
    })
  }
getRoomMessage(){
  return new Observable((observer:Observer<any>) => {
    console.log("here I am")
    this.socket.on('message', (data) => {
      observer.next(data)
    })
  })
}
  createRoom(data){
    this.socket.emit('joinRoom', (data))
  }
  getUserRooms(data){
    this.socket.emit('getUserRooms', data);
  }
  userRooms(){
    return new Observable((observer:Observer<any>) => {
      this.socket.on('userRooms', (data) => {
        observer.next(data)
      })
    })
  }

  socketDisconnect(){
    this.socket.emit('forceDisconnect', this.socket.id)
  }

}
