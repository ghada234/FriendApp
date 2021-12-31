import { Injectable } from '@angular/core';
declare let alertify:any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

//confirm

//if we click ok to confirm message execute call back function else if cancel don't do any thing
confirm(message:string,okCallBack:()=>any)
{

  alertify.confirm(message,function(e){

    if(e){
      okCallBack()
    }
    else{

    }
  }
   
  );

}

//sucess
success(message:string){
  alertify.success(message);
}


error(message:string){
  alertify.error(message);
}


warning(message:string){
  alertify.warning(message);
}

message(message:string){
  alertify.messaeg(message);
}

}
