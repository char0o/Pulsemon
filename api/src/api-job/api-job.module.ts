import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiJob } from "./api-job.entity";
import { ApiConfig } from "src/api-config/api-config.entity";
import { CreateApiJobHandler } from "./commands/create-api-job.command";

@Module({
  imports: [TypeOrmModule.forFeature([ApiJob, ApiConfig])],
  providers: [CreateApiJobHandler],
  controllers: [],
})
export class ApiJobModule {}
