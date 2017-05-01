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


    constructor(private _http: Http, private _storage: StorageService) 
    {
    }

    public Send(message: ICommand | IQuery<any>): Observable<any>
    {
        // Message class ---into---> { class_name: { class_fields }}
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
            .map(d => d.json())           
            .do(x => 
            { 
                console.log("CQRS Bus received: " + JSON.stringify(x)) 
            })
            .catch((e, c) =>         
            {
                console.log("CQRS Bus catched error: " + e.status);

                return Observable.throw(e.status);
            });
    }
}