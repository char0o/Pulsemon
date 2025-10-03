import { Command, CommandHandler } from "@nestjs/cqrs";
import { RedisService } from "../../redis/redis.service";
import { randomInt } from "crypto";
import { Logger } from "@nestjs/common";

export type CreateAuthTokenParams = {
  userId: number;
};

export class CreateAuthTokenCommand extends Command<void> {
  constructor(public readonly params: CreateAuthTokenParams) {
    super();
  }
}

@CommandHandler(CreateAuthTokenCommand)
export class CreateAuthTokenHandler {
  private readonly logger: Logger = new Logger();
  constructor(private readonly redisService: RedisService) {}

  async execute(command: CreateAuthTokenCommand): Promise<void> {
    const { userId } = command.params;

    const redisClient = this.redisService.client;

    const reverseKey = `authlink:${userId}`;

    const existingToken = await redisClient.get(reverseKey);

    if (existingToken) {
      await redisClient.del(`authlink:${existingToken}`);
      await redisClient.del(reverseKey);
    }

    const token = randomInt(100000, 1000000).toString();
    const tokenKey = `authlink:${token}`;

    this.logger.log(`Create auth token: ${token} for user ${userId}`);

    await redisClient.set(tokenKey, userId, { EX: 15 * 60 });
    await redisClient.set(reverseKey, token, { EX: 15 * 60 });
  }
}
