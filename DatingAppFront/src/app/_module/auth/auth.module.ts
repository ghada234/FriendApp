//  import { JwtModule } from "@auth0/angular-jwt";
//  import { HttpClientModule } from "@angular/common/http";
// import { NgModule } from "@angular/core";

// //this module for give token when request any of http using httpclient
 
// export function tokenGetter() {
//   return localStorage.getItem("token");
// }
 
// @NgModule({
//   bootstrap: [AuthModule],
//   imports: [
//     // ...
//     HttpClientModule,
//     JwtModule.forRoot({
//       config: {
//         tokenGetter: tokenGetter,
//         allowedDomains: ["http://localhost:53150"],
//         disallowedRoutes: ["http://example.com/examplebadroute/"],
//       },
//     }),
//   ],
// })
// export class AuthModule { }
