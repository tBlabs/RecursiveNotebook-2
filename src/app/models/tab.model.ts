export class Tab // equivalent of NoteDto in backend API
{
    public id: guid;
    public parentId: guid;
    public title: string;
    public content: string;
}