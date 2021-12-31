import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Pagination, PaginationResult } from '../_model/Pagination';
import { User } from '../_model/User';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  users:User[];
  pagination:Pagination;
  pageNumber:any=1;
  pageSize:any=5;
  likesParam:string="Likers";

  constructor(private alertify:AlertifyService,private authservice:AuthService,private userservice:UserService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>
     {
      this.users=data['users'].result;
      console.log(`users liker is ${this.users}`)
      this.pagination=data['users'].pagination;
    });

  }

  loadUsers(){
    this.pageNumber=this.pagination.currentPage;
    this.pageSize=this.pagination.itemsPerPage;
    this.userservice.getUsers(this.pageNumber,this.pageSize,null,this.likesParam).subscribe((res:PaginationResult<User[]>)=>{
      this.users=res.result;
      this.pagination=res.pagination;
    } ,error=>{this.alertify.error("error in retrivin g data")});

  }

  pageChanged(event: PageChangedEvent): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.pagination.currentPage=event.page;
    this.loadUsers();
  }


///



}
