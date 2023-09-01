export class Task_model {
  constructor(
    public title: string,
    public description: string,
    public users: [],
    public subtasks?: [],
    public status?: string,
    public id?: number,
    public author?: number
  ) {}
}
