import { ApiJob } from "../api-job/api-job.entity";
import { ApiMetric } from "../api-metric/api-metric.entity";
import { Api } from "../api/api.entity";
import { Endpoint } from "../endpoint/endpoint.entity";
import { OrganizationMember } from "../organization/member/organization-member.entity";
import { Organization } from "../organization/organization.entity";
import { User } from "../user/user.entity";
import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_URL,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.POSTGRES_DATABASE_TEST
      : process.env.POSTGRES_DATABASE,
  entities: [Endpoint, Api, ApiJob, ApiMetric, User, Organization, OrganizationMember],
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
});
