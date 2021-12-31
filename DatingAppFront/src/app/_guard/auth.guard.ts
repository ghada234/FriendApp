import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authservice:AuthService,private router:Router,private alertfiy:AlertifyService){

  }
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
   if(this._authservice.loggedIn()){
     return true;
   }
   else{
     this.alertfiy.error('sorry you need to log in');

     this.router.navigate(['/home']);
     return false
   }
  }
  
}
