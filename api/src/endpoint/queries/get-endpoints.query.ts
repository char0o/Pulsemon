import { Query, QueryHandler } from '@nestjs/cqrs';
import { Endpoint } from '../endpoint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type GetEndPointsResult = Endpoint[];

export class GetEndpointsQuery extends Query<GetEndPointsResult> {
  constructor() {
    super();
  }
}

@QueryHandler(GetEndpointsQuery)
export class GetEndpointsHandler {
  constructor(
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
  ) {}

  async execute(query: GetEndpointsQuery): Promise<GetEndPointsResult> {
    return this.endpointRepository.find();
  }
}
