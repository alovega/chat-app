import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './services/chatroom.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'chat';
  user;
  userRoom;
  rooms:any
  currentRooms:any[] = []
  constructor(private socket: SocketService, private room: ChatroomService){
    this.socket.rooms.subscribe((data) => {
      console.log("data-rooms", data)
      this.rooms = data;
    })
    this.room.getRooms().subscribe(response => {
      if(response.success){
        response.payload.forEach(data =>{
          console.log(data)
          let roomData = {
            roomId: data.id,
            recipientId: data.recipientId,
            initiatorId: data.profileId,
            initiator: data.chatInitiator.user.username,
            recipient: data.recipient.user.username,
            messages: data.chatMessage,
            username: sessionStorage.getItem('username'),
            name: sessionStorage.getItem('username') === data.recipient.user.username ? data.chatInitiator.user.username: data.recipient.user.username
          }
          this.currentRooms.push(roomData)
          this.socket.createRoom(roomData)
          this.UserRooms()
        })
        this.socket.rooms.next(this.currentRooms)
      }
    })
  }
  ngOnInit(): void {
    this.socket.userSocket({username:sessionStorage.getItem('username'), userId: sessionStorage.getItem('userId')});
  }

  onUserSelected(user){
    let data = {recipientId: user.userId}
    this.room.initiateRoom(data).subscribe(response => {
      if(response.success){
        let roomData = {
          roomId: response.payload.id,
          recipientId: response.payload.recipientId,
          initiatorId: response.payload.profileId,
          initiator: response.payload.chatInitiator.user.username,
          recipient: response.payload.recipient.user.username,
          currentUser: sessionStorage.getItem('username')
        }
        this.socket.createRoom(roomData)
        this.socket.getUserRooms({userId:sessionStorage.getItem('userId')})
      }
    })
    this.user = user;
  }
  onConversationSelected(userRoom){
    this.room.getRoomById(userRoom.roomId).subscribe((response) => {
      if(response.success){
        let roomData = {
          roomId: response.payload.id,
          recipientId: response.payload.recipientId,
          initiatorId: response.payload.profileId,
          initiator: response.payload.chatInitiator.user.username,
          recipient: response.payload.recipient.user.username,
          currentUser: sessionStorage.getItem('username'),
          messages:response.payload.chatMessage
        }
        this.socket.createRoom(roomData)
      }
    })
    this.userRoom = userRoom
  }

  UserRooms(){
    this.socket.userRooms().subscribe(data => {
      console.log("rooms", data)
      data.forEach(data => {

      })

      this.socket.rooms.next(data)
    })
  }
}