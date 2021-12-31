import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';
import { User } from '../_model/User';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/User.service';
import * as moment from 'moment';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-memberList',
  templateUrl: './memberDetail.component.html',
  styleUrls: ['./memberDetail.component.scss']
})
export class MemberDetailComponent implements OnInit {

  user:any;

  ///// for gallery
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  moment:any;

  // @ViewChild("memberTabs")memberTab;
  @ViewChild ("memberTabs", {static: true})memberTabs:TabsetComponent;
  /////
  constructor(private useservice:UserService,private alertift:AlertifyService,private route:ActivatedRoute) { }

  ngOnInit() {
    // this.loadUser();


    this.route.data.subscribe(data=>{
      this.user=data['user'];
      console.log(this.user);
    });

    //subxcribe to queryparams
    this.route.queryParams.subscribe(params=>{
      const selectedTab=params['tab'];
      console.log("selectedtab is"+selectedTab)
      this.memberTabs.tabs[selectedTab].active=true;

      console.log('hi from sub queryparams')
    });

/////////////
this.galleryOptions = [
  {
      width: '600px',
      height: '400px',
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
  
  },
  // max-width 800
  {
      breakpoint: 800,
      width: '100%',
      height: '600px',
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMargin: 20,
      thumbnailMargin: 20
  },
  // max-width 400
  {
      breakpoint: 400,
      preview: false
  }
];
//gallery images

 this.galleryImages=this.getImages();

 
this.moment=moment(this.user.lastActive).fromNow();




////////////

  }


  ///


  //get images methode
  getImages(){
    const imagesUrl =[];
  

    for (let i=0;i <this.user.photos.length;i++){
      imagesUrl.push({
        small:this.user.photos[i].url,
        medium:this.user.photos[i].url,
         big:this.user.photos[i].url,
      
      });
     

    }
    return imagesUrl;
 

    
  }

  //select tab method

  SelectTab(tabId:number){

    this.memberTabs.tabs[tabId].active=true;
  }

//  loadUser(){
//    console.log(+ this.route.snapshot.params['id']);
// this.useservice.getUser( + this.route.snapshot.params['id']).subscribe((user:User)=>{
//   console.log(this.user);
//   this.user=user;
// }),err=>{
//   this.alertift.error("there is error");
// };

//  }

}
