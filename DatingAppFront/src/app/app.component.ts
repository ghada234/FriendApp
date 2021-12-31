import { Component, OnInit } from '@angular/core';
//we use app-component to track routernavigation events because it  has router outlet directive so it  aware about 
//any  routing change 
import{Router,Event ,NavigationStart,NavigationEnd} from'@angular/router'
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from "@auth0/angular-jwt";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent   implements OnInit {
 
  jwtHelper:JwtHelperService=new JwtHelperService();
  constructor(private _authService:AuthService){

 
  }
  ngOnInit() {
  const token=localStorage.getItem('token');
  const user:any=JSON.parse(localStorage.getItem('user'));
  // const token = this.jwtHelper.tokenGetter();
  if(token){
    this._authService.decodedToken=this.jwtHelper.decodeToken(token);
   
  }
  if(user){
    this._authService.currentUser=user;
    if(user.photoUrl !== null){
      this._authService.changeMemberPhoto(user.photoUrl);
    }
    else{this._authService.changeMemberPhoto("/assets/images/facebook-user-icon-17.jpg");}
    
  }
  }
  title = 'myproject';
}
