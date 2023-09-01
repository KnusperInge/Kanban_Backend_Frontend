export class User_model {
  constructor(
    public username: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public password2: string
  ) {}
}
