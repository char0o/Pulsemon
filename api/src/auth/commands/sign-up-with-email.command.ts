import { ConflictException } from "@nestjs/common";
import { Command, CommandBus, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreateAuthTokenCommand } from "./create-auth-token.command";

export type SignUpWithEmailParams = {
  email: string;
  username: string;
};

export type SignUpWithEmailResult = User;

export class SignUpWithEmailCommand extends Command<User> {
  constructor(public readonly params: SignUpWithEmailParams) {
    super();
  }
}

@CommandHandler(SignUpWithEmailCommand)
export class SignUpWithEmailHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: SignUpWithEmailCommand): Promise<SignUpWithEmailResult> {
    const { email, username } = command.params;

    let existingUser = await this.userRepository.findOneBy({ email });

    if (!existingUser) {
      existingUser = new User({ email, username });
      await this.userRepository.save(existingUser);
    } else if (existingUser && existingUser.isVerified) {
      throw new ConflictException("Email already in use");
    }

    const params = {
      userId: existingUser.id,
    };

    await this.commandBus.execute(new CreateAuthTokenCommand(params));

    return existingUser;
  }
}
