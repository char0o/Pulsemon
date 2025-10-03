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
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { OrganizationModule } from "./organization/organization.module";
import { ConfigModule } from "@nestjs/config";
import { SeedingModule } from "./seeding/seeding-module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    dbModule,
    SeedingModule,
    RedisModule,
    EndpointModule,
    cqrsModule,
    ApiModule,
    ApiJobModule,
    ApiMetricModule,
    SchedulerModule,
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
