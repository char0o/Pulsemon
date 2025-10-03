import { Command, CommandHandler } from "@nestjs/cqrs";
import { RedisService } from "src/redis/redis.service";
import type { Request } from "express";
import { unsign } from "cookie-signature";
import { UnauthorizedException } from "@nestjs/common";

export type ValidateSessionParams = {
  request: Request;
};

export type ValidateSessionResult = boolean;

export class ValidateSessionCommand extends Command<boolean> {
  constructor(public readonly params: ValidateSessionParams) {
    super();
  }
}

@CommandHandler(ValidateSessionCommand)
export class ValidateSessionHandler {
  constructor(private readonly redisService: RedisService) {}

  async execute(command: ValidateSessionCommand): Promise<boolean> {
    const { request } = command.params;

    const redisClient = this.redisService.client;
    const secret = process.env.REDIS_SECRET;

    const cookies = request.cookies as Record<string, string> | undefined;

    const rawCookie: string | undefined = cookies?.["connect.sid"];

    if (!rawCookie) {
      return false;
    }

    let sessionId = rawCookie;
    if (rawCookie.startsWith("s:")) {
      const unsigned = unsign(rawCookie.slice(2), secret);
      if (typeof unsigned === "string") {
        sessionId = unsigned;
      } else {
        return false;
      }
    }

    const sessionData = await redisClient.get(`sess:${sessionId}`);

    if (sessionData) {
      return true;
    }

    return false;
  }
}
