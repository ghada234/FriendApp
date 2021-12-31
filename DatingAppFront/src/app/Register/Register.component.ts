import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_model/User';
import { Router } from '@angular/router';



@Component({
  selector: 'app-Register',
  templateUrl: './Register.component.html',
  styleUrls: ['./Register.component.scss']
})
export class RegisterComponent implements OnInit {
model:any={};
user:any;

@Input() ValuesFromHome:any;

@Output() CancelRegister:any=new EventEmitter();

//reactive form

registerForm:FormGroup;

  constructor(private authservice:AuthService,private alertify:AlertifyService,private fb:FormBuilder,private router:Router) { }


  ngOnInit() {
    // //inatilize regiterform
    // this.registerForm=new FormGroup({
    //   userName:new FormControl('',Validators.required),
    //   password:new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //   confirmPassword:new FormControl('',Validators.required),
    // },this.passwordMatchCustomValidator);

    this.buildRegisterForm();
  }

  //FUNCTion to build register form using formbuilder service
  buildRegisterForm(){
    this.registerForm=this.fb.group({
      gender:['female'],
      userName:['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],

      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',Validators.required],

    },{validators:this.passwordMatchCustomValidator});
  }
  //function to comapre password and confirm password
  passwordMatchCustomValidator(f:FormGroup){
    //condition ? true:false
    //MISMATCH IS the name we provided to custom validator
    return f.get('password').value === f.get('confirmPassword').value ?null:{'mismatch':true};
  }

  //register function

  Register(){

 this.user=Object.assign({},this.registerForm.value);
 console.log(`user from register ${this.user}`);
    // console.log(this.model);

    this.authservice.Register(this.registerForm.value).subscribe(data=>
       {console.log("register sucessufly");

      this.alertify.success("regiseter successfuly")
    
   },err=>{this.alertify.error("can not register")}
   ,()=>{this.authservice.login(this.registerForm.value).subscribe(()=>{
this.router.navigate(['/members'])
   })}
    )
  // console.log(this.registerForm.value);

  }
  Cancel(){

    console.log("canceled");
    this.CancelRegister.emit(false);

  }
}
