import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from 'ng2-file-upload';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ReactiveFormsModule } from '@angular/forms';

import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { JwtModule } from "@auth0/angular-jwt";
import {TimeAgoPipe} from 'time-ago-pipe';

// RECOMMENDED

// NOT RECOMMENDED (Angular 9 doesn't support this kind of import)
import { AccordionModule } from 'ngx-bootstrap/accordion';

// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgxGalleryModule } from '@kolkov/ngx-gallery';


import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { NavBarComponent } from './navBar/navBar.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './Home/Home.component';
import { RegisterComponent } from './Register/Register.component';
import { AlertifyService } from './_services/alertify.service';
import { UsersListComponent } from './usersList/usersList.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { AuthGuard } from './_guard/auth.guard';
import { UserService } from './_services/User.service';
import { UserCardComponent } from './userCard/userCard.component';
// import { AuthModule } from './_module/auth/auth.module';
import { MemberDetailComponent} from './memberDetail/memberDetail.component';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MemberEditComponent } from './memberEdit/memberEdit.component';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { PreventUnSavedChanges } from './_guard/Prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './photoEditor/photoEditor.component';
import { ListsResolver } from './_resolver/Lists.resolver';
import { MessageForUserResolver } from './_resolver/MessageForUserResolver';
import { MemberMessagesComponent } from './memberMessages/memberMessages.component';




export function tokenGetter() {
  return localStorage.getItem("token");
}



@NgModule({
  declarations: [													
    AppComponent,
      ValueComponent,
      NavBarComponent,
      HomeComponent,
      RegisterComponent,
      UsersListComponent,
      ListsComponent,
      MessagesComponent,
      UserCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      MemberMessagesComponent,
      MemberMessagesComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
 
    HttpClientModule,
    AccordionModule.forRoot(),
    //enable tracing track all events in console
    //navigation strat navigationend navigation canceld navigationcanceld navigationerror 
    //we can also use it troubleshoot erros using navigationerrors
    //we can use it to diaplay loadpage when thereis delay to activated the route
    //like delay of listemployee that take 2 seconds to ftch the data
    // RouterModule.forRoot(AppRotes,{enableTracing:true}),
    BrowserAnimationsModule,
  RouterModule.forRoot(appRoutes),
  // AuthModule,
  TabsModule.forRoot(),
  NgxGalleryModule,
  FileUploadModule,
  ReactiveFormsModule,
  BsDatepickerModule.forRoot(),
 
  PaginationModule.forRoot(),
  ButtonsModule.forRoot(),


  JwtModule.forRoot({
    config: {
      tokenGetter: tokenGetter,
      allowedDomains: ["http://localhost:53150"],
      disallowedRoutes: ["http://example.com"],
    },
  }),
    



  ],
  //service in providers array
  providers: [AuthService,AlertifyService,  AuthGuard,UserService,MemberDetailResolver,MemberListResolver,MemberEditResolver,PreventUnSavedChanges,ListsResolver,MessageForUserResolver],
  bootstrap: [AppComponent]
})

export class AppModule { }
