import { AuthService, LoginStatus, RegisterStatus } from './../services/auth.service';
import { Component } from '@angular/core';

enum AuthFormViewState
{
  Initial, Logging, LogedIn, UserNotFound, WrongPassword,
  Registering, EmailTaken
}

@Component({
  selector: 'auth',
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
export class AuthComponent
{
  private inputsVisible: boolean = true;
  private loginButtonVisible: boolean = true;
  private logoutButtonVisible: boolean = false;
  private loginButtonText: string = "Login";
  private registerButtonText: string = "Register";
  private emailInputError: boolean = false; // to nie powinno mieć nazwy określającej błąd a coś bardziej powiązanego z ramką
  private passwordInputError: boolean = false; // to nie powinno mieć nazwy określającej błąd a coś bardziej powiązanego z ramką

  SetFormState(state: AuthFormViewState)
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
      case AuthFormViewState.Initial:
        // do nothing
        break;
      case AuthFormViewState.Logging:
        this.loginButtonText = "Logging...";
        break;
      case AuthFormViewState.LogedIn:
        this.inputsVisible = false;
        this.loginButtonVisible = false;
        this.logoutButtonVisible = true;
        break;
      case AuthFormViewState.UserNotFound:
        this.emailInputError = true;
        break;
      case AuthFormViewState.WrongPassword:
        this.passwordInputError = true;
        break;
      case AuthFormViewState.Registering:
        this.registerButtonText = "Registering...";
        break;
      case AuthFormViewState.EmailTaken:
        this.emailInputError = true;
        break;
    }
  }

  constructor(private _auth: AuthService)
  {
    this.SetFormState(AuthFormViewState.Initial);
  }

  Login(email: string, pass: string): void
  {
    this.SetFormState(AuthFormViewState.Logging);

    this._auth.Login(email, pass).subscribe((status: LoginStatus) =>
    {
      switch (status)
      {
        case LoginStatus.LoggedIn: this.SetFormState(AuthFormViewState.LogedIn);
          break;
        case LoginStatus.UserNotFound: this.SetFormState(AuthFormViewState.UserNotFound);
          break;
        case LoginStatus.WrongPassword: this.SetFormState(AuthFormViewState.WrongPassword);
          break;
      }
    });
  }

  Register(email: string, pass: string): void
  {
    this.SetFormState(AuthFormViewState.Registering);

    this._auth.Register(email, pass).subscribe((status: RegisterStatus) =>
    {
      switch (status)
      {
        case RegisterStatus.Registered: this.SetFormState(AuthFormViewState.LogedIn);
          break;
        case RegisterStatus.EmailTaken: this.SetFormState(AuthFormViewState.EmailTaken);
          break;
      }
    });
  }

  Logout()
  {
    this._auth.Logout();

    this.SetFormState(AuthFormViewState.Initial);
  }
}
