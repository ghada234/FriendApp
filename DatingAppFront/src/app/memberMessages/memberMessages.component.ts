import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IMessage } from '../_model/Message';
import { User } from '../_model/User';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';

@Component({
  selector: 'app-memberMessages',
  templateUrl: './memberMessages.component.html',
  styleUrls: ['./memberMessages.component.scss']
})
export class MemberMessagesComponent implements OnInit {
 @Input() userId:number;
 messages:IMessage[];
 user:User;
 newMessage:any={};
 @ViewChild('scrollMe') private myScrollContainer: ElementRef;

 
  constructor(private authservice:AuthService,private userservice:UserService,private alertify:AlertifyService) { }

  ngOnInit() {
    this.LoadMessages()
    this.user=JSON.parse(localStorage.getItem('user'));
    this.scrollToBottom();
  }

LoadMessages(){
this.userservice.getMessageThread(this.authservice.decodedToken.nameid,this.userId).subscribe(res=>
  {
  
  this.messages=res;


},error=>{this.alertify.error("error in retriving messages");}
)
}

//send new message mthod

sendMessage(){
  this.newMessage.recipentId=this.userId;
  this.userservice.CreateMessage(this.authservice.decodedToken.nameid,this.newMessage).subscribe((res)=>{

    console.log("after subscribe")
    this.messages.push(res);
    this.newMessage.content="";

  });

}

scrollToBottom(): void {
  try {
      this.myScrollContainer.nativeElement.scrollBottom = this.myScrollContainer.nativeElement.scrollHeight;
  } catch(err) { }                 
}




}


