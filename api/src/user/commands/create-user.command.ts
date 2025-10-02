import { Command, CommandHandler } from "@nestjs/cqrs";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export type CreateUserParams = {
  email: string;
  username: string;
};

export type CreateUserResult = User;

export class CreateUserCommand extends Command<User> {
  constructor(public readonly params: CreateUserParams) {
    super();
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const { email, username } = command.params;

    const user = new User({ email, username });

    return await this.userRepository.save(user);
  }
}
