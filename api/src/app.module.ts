import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EndpointModule } from "./endpoint/endpoint.module";
import { dbModule } from "./db/postgres";
import { cqrsModule } from "./cqrs";
import { ApiModule } from "./api/api.module";
import { ApiJobModule } from "./api-job/api-job.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ApiMetricModule } from "./api-metric/api-metric.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    dbModule,
    RedisModule,
    EndpointModule,
    cqrsModule,
    ApiModule,
    ApiJobModule,
    ApiMetricModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
