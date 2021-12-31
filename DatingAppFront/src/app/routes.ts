
import { Routes } from '@angular/router';
import { HomeComponent } from './Home/Home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './memberDetail/memberDetail.component';
import { MemberEditComponent } from './memberEdit/memberEdit.component';
import { MessagesComponent } from './messages/messages.component';
import { UsersListComponent } from './usersList/usersList.component';
import { AuthGuard } from './_guard/auth.guard';
import { PreventUnSavedChanges } from './_guard/Prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolver/Lists.resolver';
import { MemberDetailResolver } from './_resolver/member-detail.resolver';
import { MemberEditResolver } from './_resolver/member-edit.resolver';
import { MemberListResolver } from './_resolver/member-list.resolver';
import { MessageForUserResolver } from './_resolver/MessageForUserResolver';


export const appRoutes: Routes=[
{path:"home" , component:HomeComponent},
{path:"members" , component:UsersListComponent,canActivate:[AuthGuard],resolve:{users:MemberListResolver}},
//here user is the var that will have the data or will storing the data in it and we will use it in memberdetail comp
{path:"members/:id" , component: MemberDetailComponent,resolve:{user:MemberDetailResolver}},

{path:"member/edit" , component:MemberEditComponent,canDeactivate:[PreventUnSavedChanges],resolve:{user:MemberEditResolver},},
{path:"messages" , component:MessagesComponent,resolve:{messages:MessageForUserResolver}},
{path:"list" , component:ListsComponent ,resolve:{users:ListsResolver}},

{path:"**" , redirectTo:"home" ,pathMatch:'full'},




];