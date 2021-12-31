import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_model/User";
import { AlertifyService } from "../_services/alertify.service";
import { UserService } from "../_services/User.service";



@Injectable()
export class MemberDetailResolver implements Resolve <User>{


    constructor ( private userservice:UserService , private router:Router,private alertify:AlertifyService){}

    ///////////resolve function
    resolve(route: ActivatedRouteSnapshot): Observable<User>{

        //we need to subscribe observable but reolver route automacilllay resolve for us 
      
        return this.userservice.getUser(route.params['id']) .pipe(
            catchError(err => {
                this.alertify.error('error in retriving data');
                 this.router.navigate(['/members']);

                return throwError(err);
                return of(null);
            })
        );

      
      
           
   

    }



}

// this.alertify.error('error in retriving data');
// this.router.navigate(['/members']);