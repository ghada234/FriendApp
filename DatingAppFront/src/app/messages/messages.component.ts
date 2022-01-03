
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Pagination, PaginationResult } from '../_model/Pagination';
import{IMessage} from '../_model/Message';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages:IMessage[];
  pagination:Pagination;
  pageNumber:number=1;
  pageSize:number=5;
  messageContainer:string="Unread";
  moments:any;
  message:IMessage;



  constructor(private authservice:AuthService,private usersevice:UserService,private alertify:AlertifyService ,private route:ActivatedRoute) {}

  ngOnInit() {
this.route.data.subscribe(data=>{
  this.messages=data['messages'].result;
  console.log("message is"+this.messages);
this.pagination=data['messages'].pagination;

//  for( var i=0;i<=this.messages.length;i++){
//    this.moments[i]=moment(this.messages[i].messageSent).fromNow();
  
// }
//  this.moments=moment(this.messages.messageSent).fromNow();

})

  }


  ///

  loadMessages(){
    this.pageNumber=this.pagination.currentPage;
    this.pageSize=this.pagination.itemsPerPage;
    this.usersevice.getMessagesUser(this.authservice.decodedToken.nameid,this.pageNumber,this.pageSize,this.messageContainer).subscribe((res:any)=>{

      this.messages=res.result;
      this.pagination=res.pagination;

    },error=>{this.alertify.error("error in retriving data")});

  }
  pageChanged(event: PageChangedEvent): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.pagination.currentPage=event.page;
    this.loadMessages();
  }

  DeleteMessage(id:number){
    this.alertify.confirm("Are you sure you want delete Message",()=>{
      this.usersevice.DeleteMessage(id,this.authservice.decodedToken.nameid).subscribe(()=>{
        this.messages.splice(_.findIndex(this.messages, {id: id}), 1);
        this.alertify.success("Deleted Message Successfully");

      },error=>{this.alertify.error("error in deleting Message")});

    });
   
  }



}
