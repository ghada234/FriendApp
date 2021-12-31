import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../_model/User";
import { UserParams } from "../_model/UserParams";
import { AlertifyService } from "../_services/alertify.service";
import { AuthService } from "../_services/auth.service";
import { UserService } from "../_services/User.service";



@Injectable()
export class MessageForUserResolver implements Resolve <Message[]>{
    // userparams:UserParams=new UserParams();

pageNumber:any=1;
pageSize:any=5;
messageContainer:string="Unread";

    constructor ( private userservice:UserService , private router:Router,private alertify:AlertifyService,private authservice:AuthService){}

    ///////////resolve function
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]>{
           
        return this.userservice.getMessagesUser(this.authservice.decodedToken.nameid,this.pageNumber,this.pageSize,this.messageContainer) .pipe(
            catchError(err => {
                this.alertify.error('error in retriving data');
                 this.router.navigate(['/home']);

                return throwError(err);
                return of(null);
            })
        );

           
   

    }

}
