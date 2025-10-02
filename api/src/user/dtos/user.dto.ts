import { User } from "../user.entity";

export class UserDto {
  constructor(user: User) {
    this.email = user.email;
    this.username = user.username;
  }

  email: string;
  username: string;
}
