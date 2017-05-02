import { AuthService, LoginStatus } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  
    <div class="container-fluid">

      <div class="row">
        <div class="col-sm-4 col-xs-12">
        <h3>Recursive Notepad</h3>
        </div>
        <div class="col-sm-8 col-xs-12">
          <auth></auth>
        </div>
      </div>
    
      <div class="row">
        <tabs *ngIf="showTabs"></tabs>
      </div>   
      <div class="row margin-top">
        <div class="col-sm-3 col-sm-offset-4">
          <button *ngIf="!showTabs" (click)="Demo()" class="btn btn-danger center-block">See Demo</button>
        <div>
      <div>
    
    </div>
    `,
    styles: [`.margin-top { margin-top: 72px }`]
})
export class AppComponent
{
  showTabs: boolean = false;

  constructor(private _auth: AuthService)
  {
    this.showTabs = _auth.IsLoggedIn();

    _auth.LoginStatusChanged.subscribe(x => this.showTabs = x);
  }

  Demo()
  {
    this._auth.Login("demo", "demo").subscribe((s: LoginStatus)=>
    {
      if (s == LoginStatus.UserNotFound) 
      {
        alert("No demo user in database");
      }
    });
  }
}
