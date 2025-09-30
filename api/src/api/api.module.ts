import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Api } from "src/api/api.entity";
import { Endpoint } from "src/endpoint/endpoint.entity";
import { GetApiEndpointsHandler } from "src/endpoint/queries/get-api-endpoints.query";
import { ApiController } from "./api.controller";
import { CreateApiHandler } from "./commands/create-api.command";

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint, Api])],
  providers: [GetApiEndpointsHandler, CreateApiHandler],
  controllers: [ApiController],
})
export class ApiModule {}
