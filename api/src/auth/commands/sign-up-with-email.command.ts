import { ConflictException } from "@nestjs/common";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";

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
  ) {}

  async execute(command: SignUpWithEmailCommand): Promise<SignUpWithEmailResult> {
    const { email, username } = command.params;

    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    const newUser = new User({ email, username });

    return await this.userRepository.save(newUser);
  }
}
