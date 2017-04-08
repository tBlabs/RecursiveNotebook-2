import { guid } from 'app/common/types';
import { IQuery } from './../IQuery.interface';

export class RegisterQuery implements IQuery<guid>
{
    public email: string;
    public password: string;

    public constructor(init?: Partial<RegisterQuery>)
    {
        Object.assign(this, init);
    }
}