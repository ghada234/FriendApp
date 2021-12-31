import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, from, pipe, fromEvent, throwError, observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators'
import 'rxjs/add/operator/catch';
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from '../_model/User';
import { BehaviorSubject } from 'rxjs'



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl="/api/auth/login";
  userToken:any;
 helper:JwtHelperService = new JwtHelperService();
 decodedToken:any;
 currentUser:User;

 //new behaviour subject instance and call it photoUrl
 //behaviour subjecthas initial value
 private photoUrl= new BehaviorSubject<string>("../../assets/images/facebook-user-icon-17.jpg");
 // cuurentphotourl get it the  componentt and subscribe to it
 currentPhotoUrl=this.photoUrl.asObservable();
  

constructor(private _http:HttpClient) { }
//change member photo method
changeMemberPhoto(photoUrl:string){
  //add photourl of user in photoUrl observable so it will have two values initial value from assets  and the new value we passed it from currnt user
  this.photoUrl.next(photoUrl);
  console.log(`photoUrl is ya ghada ${this.photoUrl}`);
}

//login function
//model here is the username and password we get from login inputs
login(model:any){
  // we want to tell api which data we will sent and here it is angular.json
const Headers=new HttpHeaders({'contet-Type':'application/json'});
const options = {
  headers: Headers
}
//we use map to just extract data we want from stream of observable
//it will return of type Response and Response header inclue alot of informations
  return this._http.post<User>(this.baseUrl,model,options).pipe(map((response:any) => {
    const user=response;
if(response){
  //save our token in locals storage in browswe


  console.log(user);

  //get token string from api
 
  //get the user from api
  //  localStorage.setItem('token',JSON.stringify(user));
   localStorage.setItem('token',response.tokenString);
   localStorage.setItem('user',JSON.stringify(response.user));
   this.userToken=response.tokenString;
   console.log(`user token is${this.userToken}`)
   this.currentUser=response.user;
  

   console.log(`currnt user is ${this.currentUser}`);
   //call function changememberphoto and pass currentuserphototoit
   if(this.currentUser.photoUrl!==null){
    this.changeMemberPhoto(this.currentUser.photoUrl);
   }
   else{this.changeMemberPhoto("../../assets/images/facebook-user-icon-17.jpg")};
   
   
   this.decodedToken=this.helper.decodeToken(localStorage.getItem('token'));

  // this.decodedToken=this.helper.decodeToken(response.tokenString);
  console.log(` decoded token is ${this.decodedToken}`);

}

  })).catch(this.HandleError);

}


//register method
Register(model:any){
  const Headers=new HttpHeaders({'contet-Type':'application/json'});
const options = {
  headers: Headers
}
  return this._http.post("/api/auth/register",model,options).catch(this.HandleError);;


}



//logrrdIn to check if token expired or not
loggedIn(){
  


   const token=  localStorage.getItem('token');
   let expDate = this.helper.getTokenExpirationDate(token);
 return !this.helper.isTokenExpired(token);

 console.log("expired dated is"+expDate);

// const token = this.helper.tokenGetter();

//     if (!token) {
//       return false;
//     }

//     return !this.helper.isTokenExpired(token);
// }

}

////////////////////


//handleerrormethod 
 private HandleError(error:any){

  const ApplicationError=error.headers.get('Application-Error');
  if(ApplicationError){

    //observable.throw invideo is deprecated
 return throwError (ApplicationError);

  }
  const serverError=JSON.parse(error);;

  let modelState="";
  if(serverError){
    for(const k in serverError){
      if (serverError[k]){
modelState+=serverError[k]+'\n';

      }
    }

  }

return throwError(modelState || 'server error');
  



}


}
