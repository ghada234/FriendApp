import { HttpClient, HttpHeaders, HttpRequest,HttpResponse,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../_model/User';
import { Observable, from, pipe, fromEvent, throwError, observable } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators'
import { PaginationResult } from '../_model/Pagination';
import { UserParams } from '../_model/UserParams';
import { IMessage } from '../_model/Message';




@Injectable({
  providedIn: 'root'
})
export class UserService {
 memberCach=new Map();

constructor(private http:HttpClient) 
{ }


//tazbeet el headers here 3shan hwa byst3ml 7aga 2dema we deprecatred




///get users function

getUsers(pageNumber:any,pageSize:any,userparam?:any,likeparam?:string){
  const paginationresult:PaginationResult<User[]>= new PaginationResult<User[]>();
  let params = new HttpParams();
  let queryString='?';
  if(pageNumber !=null &&pageSize!=null){
    // queryString+= 'pageNumber='+userparam.pageNumber+'&pageSize='+userparam.pageSize;
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    
  }
  if(userparam !=null){
    params = params.append('minAge', userparam.minAge);
    params = params.append('maxAge', userparam.maxAge);
    params = params.append('gender', userparam.gender);
    params = params.append('orderBy', userparam.orderBy);
  }
  if(likeparam==="Likers"){
    params = params.append('Likers','true');
  }
  if(likeparam==="Likees"){
    params=params.append('Likees','true');
  }



   return this.http.get<User[]>("/api/users",{ observe: 'response', params}).pipe(map((response:any)=>{
  console.log("hi");
    console.log(response);
     paginationresult.result=response.body;
    console.log(paginationresult.result);
    //  console.log(` result is ${paginationresult.result}`);
       if(response.headers.get('Pagination')!=null){
       paginationresult.pagination=JSON.parse(response.headers.get('Pagination'));
      //    console.log(JSON.parse(response.HttpHeaders.get('Pagination')));
      console.log(paginationresult.pagination);

       }
    
      return paginationresult;
     return response;
     

     
  
  
  
  
  })).catch(this.HandleError);

  //  return this.http.get<User[]>("/api/users",{headers:this.getHeader()}); 

//  return this.http.get("/api/users",{headers:this.getHeader()}).pipe(map(res =>
//   {
//   //  this.response= JSON.stringify(res);
//`${this.path}GetHotelByID/${id}`
//     console.log(res);
// }));
 
}



/////////



//getuser function
getUser(id:number):Observable<User>{
return this.http.get<User>(`/api/users/${id}`);

}

///// updateUser method

updateUser(id:number,user:any){
  return this.http.put(`/api/users/${id}`,user);

}
//set main method
setMainPhoto(userId:number,id:number){
  return this.http.post(`/api/users/${userId}/photos/${id}/setmain`,{});
}

//deletephoto metod
deletePhoto(userId:number,id:number){
  return this.http.delete(`/api/users/${userId}/photos/${id}`,{responseType: 'text'});
}

 ////// getHeader function that i used it before use jwt angular libary
sendLike(userId:number,recevierId:number){
  return this.http.post(`/api/users/${userId}/like/${recevierId}`,{}).catch(this.HandleError);
}


//messages 

getMessagesUser(id:number,pageNumber?:any,pageSize?:any,messageContainer?:string){
  const paginationresult:PaginationResult<IMessage[]>= new PaginationResult<IMessage[]>();
  let params = new HttpParams();
if(pageNumber!=null &&pageSize!=null){
params=params.append("pageNumber",pageNumber);
params=params.append("pageSize",pageSize);

}
params=params.append("messageContainer",messageContainer);
return this.http.get<IMessage[]>(`api/users/${id}/messages`,{ observe: 'response', params}).pipe(map((response:any)=>{

  paginationresult.result=response.body;

  // if(response.headers.get('Paginations')!=null){
  //   paginationresult.pagination=JSON.parse(response.headers.get("Pagination"));
  // }
  if(response.headers.get('Pagination')!=null){
    paginationresult.pagination=JSON.parse(response.headers.get('Pagination'))};

  return paginationresult;
}

));

}

/////
//gettmessage thread  message between two users
getMessageThread(id:number,recipentId:number){
  return this.http.get(`/api/users/${id}/messages/thread/${recipentId}`).pipe(map((res:any)=>{
 return res;
  })).catch(this.HandleError);
}

///
getHeader(){ 
  let header = new HttpHeaders().set(
    "Authorization",
    'Bearer '.concat(localStorage.getItem('token'))
  );
  header= header.append('content-type', 'application/json');
 
  return header;
}

/////
//private jwt function
//  private jwt(){
//  let token=localStorage.getItem('token');
//  if(token){
//    //eaders request
//    let headers=new HttpHeaders({'Authorization':'Bearer'}+ token);
//    headers.append('contet-Type','application/json');

// return {
//     headers: headers
//   }

//  }

// }

//handle error method

private HandleError(error:any){
if(error.status===400){
  throw throwError(error._body); ;
  
}

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

function res(res: any, arg1: (Response: any) => void): import("rxjs").OperatorFunction<Object, unknown> {
  throw new Error('Function not implemented.');
}
function responseType(arg0: string, responseType: any, arg2: string) {
  throw new Error('Function not implemented.');
}

