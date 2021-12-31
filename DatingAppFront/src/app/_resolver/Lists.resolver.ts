import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_model/User";
import { UserParams } from "../_model/UserParams";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/User.service";



@Injectable()
export class ListsResolver implements Resolve <User[]>{
    // userparams:UserParams=new UserParams();
    userParams:any;
likeParam:string="Likers";
pageNumber:any=1;
pageSize:any=5;

// user:User=JSON.parse(localStorage.getItem('user'));


    constructor ( private userservice:UserService , private router:Router,private alertify:AlertifyService){}

    ///////////resolve function
    resolve(route: ActivatedRouteSnapshot): Observable<User[]>{
     




        
      
        return this.userservice.getUsers(this.pageNumber,this.pageSize,null,this.likeParam) .pipe(
            catchError(err => {
                this.alertify.error('error in retriving data');
                 this.router.navigate(['/home']);

                return throwError(err);
                return of(null);
            })
        );

      
      
           
   

    }



}
