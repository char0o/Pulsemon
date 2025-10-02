import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisStore } from "connect-redis";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private _client: RedisClientType;
  private _store: RedisStore;
  private readonly logger = new Logger("Redis");
  constructor(private readonly configService: ConfigService) {
    const redisHost = configService.getOrThrow<string>("REDIS_HOST");
    const redisPort = configService.getOrThrow<string>("REDIS_PORT");
    const redisPassword = configService.getOrThrow<string>("REDIS_PASSWORD");

    this._client = createClient({
      url: `redis://default:${redisPassword}@${redisHost}:${redisPort}`,
    });

    this._client.on("error", (error: Error) =>
      this.logger.error(`Unable to connect to redis ${error.message}.`),
    );

    this._client.on("connect", () => this.logger.log("Succesfully connected to redis."));

    this._store = new RedisStore({ client: this._client });
  }
  async onModuleInit() {
    await this._client.connect();
  }
  async onModuleDestroy() {
    await this._client.disconnect();
  }

  get store() {
    return this._store;
  }

  get client() {
    return this._client;
  }
}
