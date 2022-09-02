import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';
import { SocketService } from '../services/socket.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit{
  @Input() user;
  userRoom:any  = {};
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible;
  messageList: {message:string, username:string, mine:boolean, time:string}[] = [];
  message = '';
  constructor(private chatService: ChatroomService, private socket: SocketService, private activatedRoute: ActivatedRoute) {
    this.socket.messages.subscribe((res: any) =>{
      this.messageList.push(res)
    })
    this.getRoomMessage()
  }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({room}) => {
      const data = room.payload
      let roomData={
        roomId: data.id,
        recipientId: data.recipientId,
        initiatorId: data.profileId,
        initiator: data.chatInitiator.user.username,
        recipient: data.recipient.user.username,
        messages: data.chatMessage,
        userId:sessionStorage.getItem('userId'),
        username: sessionStorage.getItem('username'),
        name: sessionStorage.getItem('username') === data.recipient.user.username ? data.chatInitiator.user.username: data.recipient.user.username
      }
      this.messageList = data.chatMessage
      this.userRoom = roomData
      this.socket.createRoom(roomData)
      this.socket.getUserRooms({userId: sessionStorage.getItem('userId')})
    })
  }

  get_or_create(data){
    this.chatService.initiateRoom(data).subscribe(response => {
      if (response.success){
        console.log(response)
      }
    })
  }


  submitMessage(event, user) {
    let value = event.target.value.trim();
    let username = user
    console.log(user)
    let data = {username, message:value}
    this.message = '';
    if (value.length < 1) return false;
    this.socket.privateMessage(data)
  }

  sendMessage(event, room){
    let value = event.target.value.trim();
    let userRoom = room
    console.log(userRoom)
    let data = {userRoom, message:value}
    console.log(data)
    this.message = '';
    if (value.length < 1) return false;
    this.socket.roomMessage(data)
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }

  getRoomMessage(){
    this.socket.getRoomMessage().subscribe((data:{message:string, username:string, time:string}) => {
      console.log("hello???")
      console.log(data)
      if(data){
          let message = {
            message: data.message, 
            username:data.username, 
            mine:sessionStorage.username===data.username ? true: false, 
            time:data.time}
        this.socket.messages.next(message)
      }
    })
  }
}
