import { Tab } from './../../../models/tab.model';
import { IQuery } from './../IQuery.interface';

export class GetNotesQuery implements IQuery<Tab[]>
{
    public id: guid;

    public constructor(init?: Partial<GetNotesQuery>)
    {
        Object.assign(this, init);
    }
}

