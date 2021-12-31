import { Component, Input, OnInit, Output,EventEmitter  } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from '../_model/Photo';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/User.service';
import * as _ from 'underscore';



@Component({
  selector: 'app-photoEditor',
  templateUrl: './photoEditor.component.html',
  styleUrls: ['./photoEditor.component.scss']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos:Photo[];
  currentMainPhoto:Photo;
  @Output() photoFromChild= new EventEmitter<string>();
  ////
  uploader:FileUploader;
  hasBaseDropZoneOver:boolean=false;
  hasAnotherDropZoneOver:boolean;
  uploadUrl=`/api/users/${this.authservice.decodedToken.nameid}/photos`


  constructor(private authservice:AuthService,private userservice:UserService,private alertify:AlertifyService) { 
  }

  ngOnInit() {
    this.initializeUploader();
  
  }

   public fileOverBase(e:any):void {
    //functionality of darg and drog
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){

    this.uploader=new FileUploader({
      url:this.uploadUrl,
      authToken:`Bearer ${localStorage.getItem('token')}`,
        isHTML5:true,
    allowedFileType:['image'],
        removeAfterUpload:true,
        autoUpload:false,
      maxFileSize:10 * 1024 *1024,
    //   disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
    //    formatDataFunctionIsAsync: true,
    //    formatDataFunction: async  (item)  => {
    //      return new Promise( (resolve, reject) => {
    //        resolve({
    //          name: item._file.name,
    //         length: item._file.size,
    //       contentType: item._file.type,    

    //     });
    //      });
        
      
    // }


    });

 this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

 this.uploader.onSuccessItem=(item,response,status,headers)=>{
 if(response){
  const  res:Photo=JSON.parse(response);
  const photo={
   id:res.id,
   url:res.url,
   dateAdded:res.dateAdded,
   isMain:res.isMain,
   describtion:res.describtion
  }
  this.photos.push(photo);
  if(photo.isMain){
    this.authservice.changeMemberPhoto(photo.url);
    this.authservice.currentUser.photoUrl=photo.url;
  

    localStorage.setItem('user',JSON.stringify(this.authservice.currentUser));
  }
 }



 };


  }
  //setmainphoto method

  setMainPhoto(photo:Photo){
    this.userservice.setMainPhoto(this.authservice.decodedToken.nameid,photo.id)
    .subscribe(
      ()=>{
        console.log("set photo to main done");
        this.currentMainPhoto=_.findWhere(this.photos,{isMain:true});
        this.currentMainPhoto.isMain=false;
        photo.isMain=true;
        // this.photoFromChild.emit(photo.url);
        this.authservice.changeMemberPhoto(photo.url);
        this.authservice.currentUser.photoUrl=photo.url;
      

        localStorage.setItem('user',JSON.stringify(this.authservice.currentUser));
    },
      error=>{
        console.log("can't set photo to main");
        this.alertify.error("cant set photo to main")
    
    }
      
      
      );


  }

  //deletephoto
   deletePhoto( id:number){
     this.alertify.confirm("are you sure you want to delete photo",()=>{
        this.userservice.deletePhoto(this.authservice.decodedToken.nameid, id).subscribe(()=>{
         this.photos.splice(_.findIndex(this.photos,{id:id}),1);
          this.alertify.success("photo has been deleted");
        },(error)=>{
          this.alertify.error("faild to delete photo");
        });
    });
    // this.userservice.deletePhoto(this.authservice.decodedToken.nameid, id).subscribe(()=>{
    //   this.photos.splice(_.findIndex(this.photos,{id:id},1));
    //   this.alertify.success("photo has been removed");
    //   console.log("delete photo");
    // });
   
  }

}
// function photo(photo: any) {
//   throw new Error('Function not implemented.');
// }

