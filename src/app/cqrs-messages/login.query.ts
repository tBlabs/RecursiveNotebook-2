import { IQuery } from './../cqrs/cqrs.bus';

export class LoginQuery implements IQuery<guid>
{
    public email: string;
    public password: string;

    public constructor(init?: Partial<LoginQuery>)
    {
        Object.assign(this, init);
    }
}