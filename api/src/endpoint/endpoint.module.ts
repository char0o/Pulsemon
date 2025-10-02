import { Module } from "@nestjs/common";
import { EndpointController } from "./endpoints.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Endpoint } from "./endpoint.entity";
import { Api } from "src/api/api.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint, Api])],
  providers: [],
  controllers: [EndpointController],
})
export class EndpointModule {}
