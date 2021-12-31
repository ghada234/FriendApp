import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";
import { MemberEditComponent } from "../memberEdit/memberEdit.component";

@Injectable({
    providedIn: 'root'

  })
  export class PreventUnSavedChanges implements CanDeactivate <MemberEditComponent>{
      constructor(){}

canDeactivate(component:MemberEditComponent){
    if(component.editForm.dirty){
        return confirm("are you sure you want to continue any unsaved changes will be lost");
    }
    return true;

}
  }

