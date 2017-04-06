import { RegisterQuery } from './cqrs/messages/register.query';
import { LoginQuery } from './cqrs/messages/login.query';
import { StorageService } from './storage.service';
import { CqrsBus } from './cqrs/cqrs-bus.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";

export enum LoginStatus { LoggedIn, UserNotFound, WrongPassword }
export enum RegisterStatus { Registered, EmailTaken }


@Injectable()
export class AuthService
{
    constructor(private _cqrs: CqrsBus, private _storage: StorageService)
    {

    }

    public IsLoggedIn(): boolean
    {
        return (this._storage.GetSessionToken() != "");
    }


    public Login(email: string, pass: string): Observable<LoginStatus>
    {
        let ret = new Subject();

        this._cqrs.Send(new LoginQuery({ email: email, password: pass })).subscribe((token: guid) =>
        {
            console.log("Token: " + token);

            this._storage.SetSessionToken(token);

            ret.next(LoginStatus.LoggedIn);
        },
            (err) =>
            {
                console.log("Err: " + err);

                switch (err)
                {
                    case 404: ret.next(LoginStatus.UserNotFound);
                        break;
                    case 401: ret.next(LoginStatus.WrongPassword);
                        break;
                }

                this._storage.SetSessionToken("");
            });

        return ret;
    }


    public Register(email: string, pass: string): Observable<RegisterStatus>
    {
        let ret = new Subject();

        this._cqrs.Send(new RegisterQuery({ email: email, password: pass })).subscribe((token: guid) =>
        {
            console.log("Token: " + token);

            this._storage.SetSessionToken(token);

            ret.next(RegisterStatus.Registered);
        },
            (err) =>
            {
                console.log("Err: " + err);

                switch (err)
                {
                    case 406: ret.next(RegisterStatus.EmailTaken);
                        break;
                }
            });

        return ret;
    }

    public Logout(): void
    {
        this._storage.SetSessionToken("");
    }

}