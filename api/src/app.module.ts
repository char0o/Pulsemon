import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EndpointModule } from "./endpoint/endpoint.module";
import { dbModule } from "./db/postgres";
import { cqrsModule } from "./cqrs";
import { ApiModule } from "./api/api.module";
import { ApiConfigModule } from "./api-config/api-config.module";
import { ApiJobModule } from "./api-job/api-job.module";
import { SchedulerModule } from "./scheduler/scheduler.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    dbModule,
    EndpointModule,
    cqrsModule,
    ApiModule,
    ApiJobModule,
    ApiConfigModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
