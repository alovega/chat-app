import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ChatroomService } from '../services/chatroom.service';

import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() userRoom;
  @Input() roomList:{roomId:string, recipientId: string, initiatorId:string, initiator:string, recipient:string, messages:any[], name:string}[];
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  @Output() contactClicked: EventEmitter<any> = new EventEmitter();
  searchText: string;
  currentuser = sessionStorage.getItem('username')
  messageList: {message:string, username:string, time:string, mine:boolean}[] = []
  users:any = [];
  rooms:any = [];
  isShown:boolean = false
  // conversations = [
  //   {
  //     name: 'David',
  //     time: '8:21',
  //     latestMessage: 'Hi there!!',
  //     latestMessageRead: false,
  //     messages: [
  //       { id: 1, body: 'Hello world', time: '8:21', me: true },
  //       { id: 2, body: 'How are you?', time: '8:21', me: false },
  //       { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
  //       { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
  //     ],
  //   },
  //   {
  //     name: 'James',
  //     time: '8:21',
  //     latestMessage: 'wow',
  //     latestMessageRead: true,
  //     messages: [
  //       { id: 1, body: 'Hello world', time: '8:21', me: true },
  //       { id: 2, body: 'How are you?', time: '8:21', me: false },
  //       { id: 3, body: 'I am fine thanks', time: '8:21', me: true },
  //       { id: 4, body: 'Glad to hear that', time: '8:21', me: false },
  //     ],
  //   },
  // ];

  get filteredRooms() {
    return this.roomList.filter((room) => {
      return (
        room.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }

  get filteredContacts(){
    return this.users.filter((contact) => {
      return(
        contact.username.toLowerCase().includes(this.searchText.toLowerCase())
      )
    })
  }

  toggleClass = () => {
   this.isShown = !this.isShown
}

  constructor(private router: Router, private socketService: SocketService) {}
    // users:any = this.socketService.getOnlineUsers()
    ngOnInit(): void {
      console.log("sidebar",this.roomList)
      this.socketService.onOnlineUsers().subscribe(data =>{
        this.users = data.filter(data =>data.username !== sessionStorage.getItem('username'))
        console.log(this.users)
      })
  }

  getMessage(){
    this.socketService.getMessage().subscribe((data:{message:string, username:string, time:string}) => {
      if(data){
        this.messageList.push({message: data.message, username:data.username, mine:false, time:data.time})
      }
    }) 
  }


  logout(){
    sessionStorage.clear()
    this.router.navigate(['login'])
    this.socketService.socketDisconnect();
  }
}
