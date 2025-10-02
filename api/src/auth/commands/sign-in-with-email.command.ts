import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Command, CommandBus, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { RedisService } from "src/redis/redis.service";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { CreateAuthTokenCommand } from "./create-auth-token.command";

export type SignInWithEmailParams = {
  email: string;
};

export type SignUpWithEmailResult = void;

export class SignInWithEmailCommand extends Command<SignUpWithEmailResult> {
  constructor(public readonly params: SignInWithEmailParams) {
    super();
  }
}

@CommandHandler(SignInWithEmailCommand)
export class SignInWithEmailHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: SignInWithEmailCommand): Promise<void> {
    const { email } = command.params;

    const user = await this.userRepository.findOneBy({ email: email });

    if (!user) {
      throw new NotFoundException("User with email doesn't exist");
    }

    if (!user.isVerified) {
      throw new ForbiddenException("User is not verified");
    }

    const params = {
      userId: user.id,
    };

    await this.commandBus.execute(new CreateAuthTokenCommand(params));
  }
}
