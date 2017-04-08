import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ICommand } from './ICommand.interface';
import { IQuery } from "./IQuery.interface";
import { StorageService } from './../storage.service';
import "rxjs";

@Injectable()
export class CqrsBus
{
    private API: string = "http://localhost:1234/api/cqrsbus";

    //  private options: RequestOptions;


    constructor(private _http: Http, private _storage: StorageService) 
    {
        //this.options.set("Content-type", "application/json");
    }

    public Send(message: ICommand | IQuery<any>): Observable<any>
    {
        let j = {};
        j[message.constructor.name] = message;
        let json = JSON.stringify(j);

        console.log("CQRS Bus send: " + json);


        let headers = new Headers(
            {
                "Content-type": "application/json",
                'Authorization': this._storage.GetSessionToken()
            });
        let options = new RequestOptions({ headers: headers });


        return this._http
            .post(this.API, json, options)
            .do(x => { console.log("CQRS Bus received: " + x) })
            .map(d => d.json())
            .catch((e, c) => // Jakiego typu jest e ?!?!?!?!!?!?!?!?          
            {
                console.log("catched err: " + e.status);

                return Observable.throw(e.status);
            });
    }
}