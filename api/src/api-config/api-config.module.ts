import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Api } from "src/api/api.entity";
import { ApiConfig } from "./api-config.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ApiConfig, Api])],
  providers: [],
  controllers: [],
})
export class ApiConfigModule {}
