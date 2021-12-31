import { Photo } from "./Photo";

export interface User {

    // for list user
id:number;
userName:string;
knownAs:string;
age:number;
gender:string;

created:Date;
lastActive:Date;
country:string;
city:string;
photoUrl:string;


///// for user detail

interests?:string;
introduction?:string;
lookingFor?:string;
photos?:Photo[];






}
