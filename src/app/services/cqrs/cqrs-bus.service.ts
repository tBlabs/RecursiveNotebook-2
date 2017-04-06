import { Observable } from 'rxjs/Observable';
import { ICommand } from './ICommand.interface';
import { IQuery } from "./IQuery.interface";
import { StorageService } from './../storage.service';
import { Http, Headers } from '@angular/http';
import { Injectable } from "@angular/core";
import "rxjs";

@Injectable()
export class CqrsBus
{
    private API: string = "http://localhost:1234/api/cqrsbus";

    private options: Headers = new Headers();


    constructor(private _http: Http, private _storage: StorageService) 
    { 
        this.options.set("Content-type", "application/json");
    }

    public Send(message: ICommand | IQuery<any>): Observable<any>
    {
        let j = {};
        j[message.constructor.name] = message;
        let json = JSON.stringify(j);
        
        console.log("Package: " + json);
        console.log("Headers: ");
        this.options.forEach((value, name) => console.log("- " + name + " = [" + value + "]"));
     
        this.options.set('Authorization', this._storage.GetSessionToken());

        return this._http
            .post(this.API, json, { headers: this.options })
            .map(d => d.json())   
            .catch((e,c)=>{ // Jakiego typu jest e ?!?!?!?!!?!?!?!?
                console.log("catched err: "+e.status);
             
                return Observable.throw(e.status);
            });
    }
}