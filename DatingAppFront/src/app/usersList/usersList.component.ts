import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Pagination, PaginationResult } from '../_model/Pagination';
import { User } from '../_model/User';
import { UserParams } from '../_model/UserParams';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';

@Component({
  selector: 'app-usersList',
  templateUrl: './usersList.component.html',
  styleUrls: ['./usersList.component.scss']
})
export class UsersListComponent implements OnInit {

users:any;
userparams:UserParams=new UserParams();
maxSizeBtn:any=40;

  pageSize=5;
  pageNumber=1;
  pagination:Pagination;
  //get current looged in user
  user:User=JSON.parse(localStorage.getItem('user'));
  
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}];
  
  constructor(private userservice:UserService,private alertify:AlertifyService,private route:ActivatedRoute,private authservice:AuthService) {  }

  ngOnInit() {
  
      this.route.data.subscribe(data=>{
        this.users=data['users'].result;
        console.log(this.users)
        this.pagination=data['users']. pagination;


      })

      //initial value of gender and ages
      console.log(`user is ${this.user}`);
       this.userparams.gender=this.user.gender==='male'?'male':'female';
      // this.userparams.gender="coco";
      this.userparams.maxAge=70;
      this.userparams.minAge=18;
      this.userparams.orderBy='lastActive';

    
  }
  loadUsers(){
    this.pageNumber=this.pagination.currentPage;
    this.pageSize=this.pagination.itemsPerPage;
    this.userservice.getUsers(this.pageNumber,this.pageSize,this.userparams).subscribe((res:PaginationResult<User[]>)=>{
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

  //resset filter method
  resetFilter(){
    this.userparams.gender=this.user.gender==='male'?'female':'male';
    this.userparams.maxAge=70;
    this.userparams.minAge=18;
    this.loadUsers();
  }

  ///
//    loadUsers(){
//      this.userparams.pageNumber=1;
//      this.userparams.pageSize=5;
//       this.userservice.getUsers(this.userparams).subscribe(users=>
//       {
//          console.log(`users is${users}`);
//           this.users=users.values;
// // console.log(users.headers.get)


//        },error=>{
//       this.alertify.error("error in retriving data");
//         })
//    }
sendLikes(id:number,user:User){

  this.userservice.sendLike(this.authservice.decodedToken.nameid,id).subscribe(x=>{this.alertify.success(`you have liked user ${user.knownAs}`)},error=>{this.alertify.error("users is already be liked")})
}

}
