import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Api } from "src/api/api.entity";
import { Endpoint } from "src/endpoint/endpoint.entity";
import { GetApiEndpointsHandler } from "src/endpoint/queries/get-api-endpoints.query";
import { ApiController } from "./api.controller";
import { CreateApiHandler } from "./commands/create-api.command";
import { CreateApiConfigHandler } from "src/api-config/commands/create-api-config.command";
import { ApiConfig } from "src/api-config/api-config.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint, Api, ApiConfig])],
  providers: [GetApiEndpointsHandler, CreateApiHandler, CreateApiConfigHandler],
  controllers: [ApiController],
})
export class ApiModule {}
