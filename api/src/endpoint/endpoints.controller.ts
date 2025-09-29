import { Controller, Get, Req } from '@nestjs/common';
import { EndpointDto } from './endpoint.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetEndpointsQuery } from './queries/get-endpoints.query';

@Controller('api/endpoint')
export class EndpointController {
  constructor(private readonly queryBus: QueryBus) {}
  @Get()
  async getEndpoints(@Req() request: Request): Promise<EndpointDto[]> {
    return this.queryBus.execute(new GetEndpointsQuery());
  }
}
