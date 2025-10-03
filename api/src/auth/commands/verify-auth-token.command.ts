import { NotFoundException } from "@nestjs/common";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { RedisService } from "src/redis/redis.service";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";

export type VerifyAuthTokenParams = {
  token: string;
};

export type VerifyAuthTokenResult = User;

export class VerifyAuthTokenCommand extends Command<User> {
  constructor(public readonly params: VerifyAuthTokenParams) {
    super();
  }
}

@CommandHandler(VerifyAuthTokenCommand)
export class VerifyAuthTokenHandler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: VerifyAuthTokenCommand): Promise<User> {
    const { token } = command.params;

    const redisClient = this.redisService.client;
    const key = `authlink:${token}`;

    const userId = await redisClient.get(key);

    if (!userId) {
      throw new NotFoundException("Auth token is invalid or expired");
    }

    const user = await this.userRepository.findOneBy({ id: +userId });

    if (!user) {
      throw new NotFoundException("No user found for the auth token");
    }

    if (!user.isVerified) {
      user.isVerified = true;
    }

    await this.userRepository.save(user);

    await redisClient.del(key);
    await redisClient.del(`authlink:${userId}`);

    return user;
  }
}
