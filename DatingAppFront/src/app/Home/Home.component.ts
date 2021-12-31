import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss']
})
export class HomeComponent implements OnInit {
 registerMode:boolean=false;

 values:any;
  constructor(private http:HttpClient) { }

  ngOnInit() 
  {
    this.getValues();
  }
  registerToggle(){
    this.registerMode=true;
  }


  getValues(){

    this.http.get('/api/ValuesController1').subscribe(response=>{

console.log(response);
this.values=response;


    });
  }

  CancelRegisterMode(registerm:boolean){
    this.registerMode=registerm;

  }


}
