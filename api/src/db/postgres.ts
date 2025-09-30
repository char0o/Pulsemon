import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "dotenv";
import path from "path";
import { Endpoint } from "../endpoint/endpoint.entity";
import { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";
import { Api } from "../api/api.entity";
import { ApiJob } from "../api-job/api-job.entity";
import { ApiConfig } from "../api-config/api-config.entity";

config({ path: path.resolve(__dirname, "../../../.env") });
export const migrations = [__dirname + "/migrations/**/*.ts"];

export const entities = [Endpoint, Api, ApiJob, ApiConfig];

const host = process.env.POSTGRES_URL!;
const port = Number(process.env.POSTGRES_PORT!);
const username = process.env.POSTGRES_USERNAME!;
const password = process.env.POSTGRES_PASSWORD!;
const database = process.env.POSTGRES_DATABASE!;

const options = {
  type: "postgres",
  host,
  port,
  username,
  password,
  database,
  entities,
  migrations,
} as const satisfies DataSourceOptions;

export const dbModule = TypeOrmModule.forRoot(options);

export const dataSource = new DataSource(options);
