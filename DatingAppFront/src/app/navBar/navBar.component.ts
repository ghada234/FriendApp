import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_model/User';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.scss']
})
export class NavBarComponent implements OnInit {

  model:any={};
  // loggedIn:boolean=false;
  myToken:any;
  user:User;
photoUrl:string;
  constructor(public authservice:AuthService,private alertify:AlertifyService,private router:Router, private userservice:UserService) { }

  ngOnInit() {
    // this.userservice.getUser(this._authservice.decodedToken.nameid).subscribe(res=>{
    //   console.log(res);
    //   this.user=res;
    
    // },error=>{console.log("error")});
    this.authservice.currentPhotoUrl.subscribe(photourl=>{this.photoUrl=photourl});
      
  }

  Login(){
    this.authservice.login(this.model).subscribe(data=>
      {
        
        console.log("logged sucessufly")
        this.alertify.success("logged successfuly")
        
        ;
      console.log("data");
      // this.loggedIn=true;
    },error=>{
      
      console.log(error);
      this.alertify.error(error);
    
    }, ()=>{
     this.router.navigate(['/members']);
    }
   );




  }

  //function log out
  logOut(){

    this.authservice.userToken=null;
    localStorage.removeItem('token');
    console.log("loggedout");
    this.alertify.warning("you logged out");
    this.authservice.currentUser=null;
    localStorage.removeItem('user');
    this.router.navigate(['/home']);
    // this.loggedIn=false;
  }
  
  // loggedIn(){

  //   // const token=localStorage.getItem('token');
  //   // return !!token;
  //  return this._authservice.loggedIn();

  // }



  }

