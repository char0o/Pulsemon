import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchedulerService } from "./scheduler.service";
import { HttpModule } from "@nestjs/axios";
import { ApiJob } from "src/api-job/api-job.entity";
import { Api } from "src/api/api.entity";
import { ApiMetric } from "src/api-metric/api-metric.entity";
import { CreateApiMetricHandler } from "src/api-metric/commands/create-api-metric.command";

@Module({
  imports: [TypeOrmModule.forFeature([Api, ApiJob, ApiMetric]), HttpModule],
  providers: [SchedulerService, CreateApiMetricHandler],
  controllers: [],
})
export class SchedulerModule {}
