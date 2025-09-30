import { Module } from "@nestjs/common";
import { EndpointController } from "./endpoints.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Endpoint } from "./endpoint.entity";
import { Api } from "src/api/api.entity";
import { CreateEndpointHandler } from "./commands/create-endpoint.command";

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint, Api])],
  providers: [CreateEndpointHandler],
  controllers: [EndpointController],
})
export class EndpointModule {}
