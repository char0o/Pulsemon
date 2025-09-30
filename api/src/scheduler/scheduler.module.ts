import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchedulerService } from "./scheduler.service";
import { HttpModule } from "@nestjs/axios";
import { ApiJob } from "src/api-job/api-job.entity";
import { Api } from "src/api/api.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Api, ApiJob]), HttpModule],
  providers: [SchedulerService],
  controllers: [],
})
export class SchedulerModule {}
