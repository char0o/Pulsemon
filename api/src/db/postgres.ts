import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Endpoint } from "../endpoint/endpoint.entity";
import { Api } from "../api/api.entity";
import { ApiJob } from "../api-job/api-job.entity";
import { ApiMetric } from "../api-metric/api-metric.entity";
import { User } from "../user/user.entity";
import { Organization } from "../organization/organization.entity";
import { OrganizationMember } from "../organization/member/organization-member.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const migrations = [__dirname + "/migrations/**/*.ts"];

export const entities = [Endpoint, Api, ApiJob, ApiMetric, User, Organization, OrganizationMember];

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
