import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {





  
   
values:any;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.getValues();
  }
  getValues(){

    this.http.get('/api/ValuesController1').subscribe(response=>{

console.log(response);
this.values=response;


    });
  }

}
