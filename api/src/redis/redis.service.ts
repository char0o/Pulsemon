import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { RedisStore } from "connect-redis";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private _store: RedisStore;
  private readonly logger = new Logger();
  constructor() {
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisPassword = process.env.REDIS_PASSWORD;

    this.client = createClient({
      url: `redis://default:${redisPassword}@${redisHost}:${redisPort}`,
    });

    this.client.on("error", (error: Error) =>
      this.logger.error(`Unable to connect to redis ${error.message}.`),
    );

    this.client.on("connect", () => this.logger.log("Succesfully connected to redis."));

    this._store = new RedisStore({ client: this.client });
  }
  async onModuleInit() {
    await this.client.connect();
  }
  async onModuleDestroy() {
    await this.client.disconnect();
  }

  get store() {
    return this._store;
  }
}
