import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const dbModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
    type: "postgres",
    host: config.getOrThrow<string>("POSTGRES_URL"),
    port: config.getOrThrow<number>("POSTGRES_PORT"),
    username: config.getOrThrow<string>("POSTGRES_USERNAME"),
    password: config.getOrThrow<string>("POSTGRES_PASSWORD"),
    database: config.getOrThrow<string>("POSTGRES_DATABASE"),
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  }),
});
