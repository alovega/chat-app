import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatroomService } from '../services/chatroom.service';
import { SocketService } from '../services/socket.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnChanges{
  @Input() user;
  @Input() userRoom;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  emojiPickerVisible;
  messageList: {message:string, username:string, mine:boolean, time:string}[] = [];
  message = '';
  constructor(private chatService: ChatroomService, private socket: SocketService) {}
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getMessage()
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
  getMessage(){
    this.socket.getMessage().subscribe((data:{message:string, username:string, time:string}) => {
      if(data){
        console.log('current', this.user)
        console.log('messages', data)
        console.log(this.messageList)
        this.messageList.push({
          message: data.message, 
          username:data.username, 
          mine:this.user.username===data.username ? true: false, 
          time:data.time})
      }
    }) 
  }

  getRoomMessage(){
    this.socket.getRoomMessage().subscribe((data:{message:string, username:string, time:string}) => {
      if(data){
        console.log('current', this.user)
        console.log('messages', data)
        console.log(this.messageList)
        this.messageList.push({
          message: data.message, 
          username:data.username, 
          mine:this.user.username===data.username ? true: false, 
          time:data.time})
      }
    })
  }
}
