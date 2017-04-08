import { Tab } from './../../../models/tab.model';
import { ICommand } from './../ICommand.interface';

export class UpdateNoteCommand implements ICommand
{
    public tab: Tab;

    public constructor(tab: Tab)
    {
        this.tab = tab;   
    }
}
