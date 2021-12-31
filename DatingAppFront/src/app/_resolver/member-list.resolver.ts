import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_model/User";
import { UserParams } from "../_model/UserParams";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/User.service";



@Injectable()
export class MemberListResolver implements Resolve <User[]>{
    userparams:UserParams=new UserParams();

pageSize=5;
pageNumber=1;
user:User=JSON.parse(localStorage.getItem('user'));


    constructor ( private userservice:UserService , private router:Router,private alertify:AlertifyService){}

    ///////////resolve function
    resolve(route: ActivatedRouteSnapshot): Observable<User[]>{
     

console.log(this.user);
// this.userparams.gender=this.user.gender==='female'?'female':'male';
if(this.user.gender==="female"){
   
    this.userparams.gender="female";
}if(this.user.gender==="male"){
    this.userparams.gender="male";
}
this.userparams.maxAge=70;
this.userparams.minAge=18;
this.userparams.orderBy='lastActive';

        //we need to subscribe observable but reolver route automacilllay resolve for us 
      
        return this.userservice.getUsers(this.pageNumber,this.pageSize,this.userparams) .pipe(
            catchError(err => {
                this.alertify.error('error in retriving data');
                 this.router.navigate(['/home']);

                return throwError(err);
                return of(null);
            })
        );

      
      
           
   

    }



}

// this.alertify.error('error in retriving data');
// this.router.navigate(['/members']);