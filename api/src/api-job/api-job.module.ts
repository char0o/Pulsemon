import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiJob } from "./api-job.entity";
import { CreateApiJobHandler } from "./commands/create-api-job.command";
import { Api } from "src/api/api.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ApiJob, Api])],
  providers: [CreateApiJobHandler],
  controllers: [],
})
export class ApiJobModule {}
