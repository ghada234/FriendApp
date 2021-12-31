import { Component, Input, OnInit } from '@angular/core';
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

 
  constructor(private authservice:AuthService,private userservice:UserService,private alertify:AlertifyService) { }

  ngOnInit() {
    this.LoadMessages()
    this.user=JSON.parse(localStorage.getItem('user'));
  }

LoadMessages(){
this.userservice.getMessageThread(this.authservice.decodedToken.nameid,this.userId).subscribe(res=>
  {
  console.log(res);
  this.messages=res;


},error=>{this.alertify.error("error in retriving messages");}
)
}

}


