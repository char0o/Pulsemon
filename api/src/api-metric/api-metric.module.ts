import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApiMetric } from "./api-metric.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ApiMetric])],
  providers: [],
  controllers: [],
})
export class ApiMetricModule {}
