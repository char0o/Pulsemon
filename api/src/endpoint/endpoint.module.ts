import { Module } from '@nestjs/common';
import { EndpointController } from './endpoints.controller';
import { GetEndpointsHandler } from './queries/get-endpoints.query';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Endpoint } from './endpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Endpoint])],
  providers: [GetEndpointsHandler],
  controllers: [EndpointController],
})
export class EndpointModule {}
