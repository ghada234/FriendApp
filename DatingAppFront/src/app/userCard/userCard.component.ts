import { Component, Input, OnInit } from '@angular/core';
import { User } from '../_model/User';

@Component({
  selector: 'app-userCard',
  templateUrl: './userCard.component.html',
  styleUrls: ['./userCard.component.css']
})
export class UserCardComponent implements OnInit {

  //send from parent userlist component to user card component
  @Input() user:any;


  constructor() { }

  ngOnInit() {
  }

}
