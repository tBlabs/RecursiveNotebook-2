import { IQuery } from './../cqrs/cqrs.bus';

export class RegisterQuery implements IQuery<guid>
{
    public email: string;
    public password: string;

    public constructor(init?: Partial<RegisterQuery>)
    {
        Object.assign(this, init);
    }
}