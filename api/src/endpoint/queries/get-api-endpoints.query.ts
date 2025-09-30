import { Query, QueryHandler } from "@nestjs/cqrs";
import { Endpoint } from "../endpoint.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Api } from "src/api/api.entity";
import { NotFoundException } from "@nestjs/common";

export type GetApiEndPointsParams = {
  apiId: number;
};

export type GetApiEndPointsResult = Endpoint[];

export class GetApiEndpointsQuery extends Query<GetApiEndPointsResult> {
  constructor(public readonly params: GetApiEndPointsParams) {
    super();
  }
}

@QueryHandler(GetApiEndpointsQuery)
export class GetApiEndpointsHandler {
  constructor(
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
  ) {}

  async execute(query: GetApiEndpointsQuery): Promise<GetApiEndPointsResult> {
    const { apiId } = query.params;

    const api = await this.apiRepository.findOne({
      where: { id: apiId },
      relations: ["endpoints"],
    });

    if (!api) {
      throw new NotFoundException("No API found with provided Id");
    }

    return api.endpoints;
  }
}
