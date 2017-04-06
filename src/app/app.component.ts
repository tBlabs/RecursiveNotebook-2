import { RegisterQuery } from './cqrs-messages/register.query';
import { StorageService } from './storage.service';
import { Component } from '@angular/core';
import { CqrsBus } from "app/cqrs/cqrs.bus";
import { LoginQuery } from "app/cqrs-messages/login.query";
import 'rxjs';

enum LoginFormViewState
{
  Initial, Logging, LogedIn, UserNotFound, WrongPassword,
  Registering, EmailTaken
}

@Component({
  selector: 'app-root',
  template: `
  <input type="text" #email
         [hidden]="!inputsVisible"
         [class.red-border]="emailInputError"
         value="foo">
  <input type="text" #pass 
         [hidden]="!inputsVisible"    
         [class.red-border]="passwordInputError"
         value="bar">
  <button *ngIf="loginButtonVisible"
         (click)="Login(email.value, pass.value)">{{ loginButtonText }}</button>
  <button *ngIf="logoutButtonVisible" 
         (click)="Logout()">Logout</button>

  <button *ngIf="loginButtonVisible"
         (click)="Register(email.value, pass.value)">{{ registerButtonText }}</button>

  `,
  styles: ['.red-border { border-color: red }']
})
export class AppComponent
{
  private inputsVisible: boolean = true;
  private loginButtonVisible: boolean = true;
  private logoutButtonVisible: boolean = false;
  private loginButtonText: string = "Login";
  private registerButtonText: string = "Register";
  private emailInputError: boolean = false; // to nie powinno mieć nazwy określającej błąd a coś bardziej powiązanego z ramką
  private passwordInputError: boolean = false; // to nie powinno mieć nazwy określającej błąd a coś bardziej powiązanego z ramką

  SetFormState(state: LoginFormViewState)
  {
    this.inputsVisible = true;
    this.loginButtonText = "Login";
    this.registerButtonText = "Register";
    this.loginButtonVisible = true;
    this.logoutButtonVisible = false;
    this.emailInputError = false;
    this.passwordInputError = false;

    switch (state)
    {
      default:
      case LoginFormViewState.Initial:
        // do nothing
        break;
      case LoginFormViewState.Logging:
        this.loginButtonText = "Logging...";
        break;
      case LoginFormViewState.LogedIn:
        this.inputsVisible = false;
        this.loginButtonVisible = false;
        this.logoutButtonVisible = true;
        break;
      case LoginFormViewState.UserNotFound:
        this.emailInputError = true;
        break;
      case LoginFormViewState.WrongPassword:
        this.passwordInputError = true;
        break;
      case LoginFormViewState.Registering:
        this.registerButtonText = "Registering...";
        break;
      case LoginFormViewState.EmailTaken:
        this.emailInputError = true;
        break;
    }
  }

  constructor(private _cqrs: CqrsBus, private _storage: StorageService)
  {
    this.SetFormState(LoginFormViewState.Initial);
  }



  Login(email: string, pass: string): void
  {
    this.SetFormState(LoginFormViewState.Logging);

    this._cqrs.Send(new LoginQuery({ email: email, password: pass })).subscribe((token: guid) =>
    {
      console.log("Token: " + token);

      this._storage.SetSessionToken(token);
      this.SetFormState(LoginFormViewState.LogedIn);
    },
      (err) =>
      {
        console.log("Err: " + err);

        switch (err)
        {
          case 404: this.SetFormState(LoginFormViewState.UserNotFound);
            break;
          case 401: this.SetFormState(LoginFormViewState.WrongPassword);
            break;
        }

        this._storage.SetSessionToken("");
      });
  }


  Register(email: string, pass: string): void
  {
    this.SetFormState(LoginFormViewState.Registering);


    this._cqrs.Send(new RegisterQuery({ email: email, password: pass })).subscribe((token: guid) =>
    {
      console.log("Token: " + token);

      this._storage.SetSessionToken(token);
      this.SetFormState(LoginFormViewState.LogedIn);
    },
      (err) =>
      {
        console.log("Err: " + err);

        switch (err)
        {
          case 406: this.SetFormState(LoginFormViewState.EmailTaken);
            break;
        }
      });
  }

  Logout()
  {
    this._storage.SetSessionToken("");
    this.SetFormState(LoginFormViewState.Initial);
  }
}
