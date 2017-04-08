import { UpdateNoteCommand } from './cqrs/messages/tab-title-update.command';
import { GetNotesQuery } from './cqrs/messages/get-notes.query';
import { Tab } from './../models/tab.model';
import { guid } from 'app/common/types';
import { CqrsBus } from './cqrs/cqrs-bus.service';
import { Http, URLSearchParams, RequestOptionsArgs, ResponseContentType, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AddNoteCommand } from "app/services/cqrs/messages/add-note.command";
import { UUID } from "angular2-uuid";
import { DeleteNotesCommand } from "app/services/cqrs/messages/delete-notes.command";

@Injectable()
export class TabsService
{
    constructor(private _cqrs: CqrsBus)
    {

    }

    public GetChildren(parentId: guid): Observable<Tab[]> 
    {
        return this._cqrs.Send(new GetNotesQuery({ id: parentId }));
    }

    public AddSibling(parentId: guid, title: string): Observable<Tab> 
    {
        let id: guid = UUID.UUID();
        let tab = new Tab();

        tab.id = id;
        tab.parentId = parentId;
        tab.title = title;
        tab.content = "";

        return this._cqrs.Send(new AddNoteCommand({ id: id, parentId: parentId, title: title }))
            .map(x => tab );
    }

    public Update(tab: Tab): Observable<void>
    {
        return this._cqrs.Send(new UpdateNoteCommand(tab));
    }

    public Delete(id: guid): Observable<void>
    {
        return this._cqrs.Send(new DeleteNotesCommand({ id: id }));
    }
}
