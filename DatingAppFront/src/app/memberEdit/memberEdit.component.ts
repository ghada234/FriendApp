import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_model/User';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';

@Component({
  selector: 'app-memberEdit',
  templateUrl: './memberEdit.component.html',
  styleUrls: ['./memberEdit.component.scss']
})
export class MemberEditComponent implements OnInit {

  user:User;
  @ViewChild('editForm') editForm:NgForm;
  photoUrl:string;
  constructor(private route:ActivatedRoute,private alertify:AlertifyService,private userService:UserService,private authservice:AuthService) { }

  ngOnInit() {
this.route.data.subscribe(data=>{
  this.user=data['user'];
  console.log(`user is ${this.user}`)
});
//subcribe to route paras



this.authservice.currentPhotoUrl.subscribe(photourl=>{this.photoUrl=photourl});
  }

  //////

  updateUser(){

    console.log(this.user);
    this.userService.updateUser(this.authservice.decodedToken.nameid,this.user).subscribe(
      next=>{
      this.alertify.success("User Updated Successfuly");
      this.editForm.reset(this.user);
    } ,error=>{
      this.alertify.error(error);
    });
  
  
  }
//   photoToParent(photoUrl){
// this.user.photoUrl=photoUrl;
//   }

}
