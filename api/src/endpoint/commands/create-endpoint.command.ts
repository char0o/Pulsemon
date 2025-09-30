import { Command, CommandHandler } from "@nestjs/cqrs";
import { Endpoint } from "../endpoint.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiMethods } from "../api-method.constants";
import { Api } from "src/api/api.entity";
import { NotFoundException } from "@nestjs/common";

export type CreateEndpointParams = {
  apiId: number;
  path: string;
  method: ApiMethods;
  description?: string;
};

export type CreateEndpointResult = Endpoint;

export class CreateEndpointCommand extends Command<Endpoint> {
  constructor(public readonly params: CreateEndpointParams) {
    super();
  }
}

@CommandHandler(CreateEndpointCommand)
export class CreateEndpointHandler {
  constructor(
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
  ) {}

  async execute(command: CreateEndpointCommand): Promise<CreateEndpointResult> {
    const { apiId, path, method, description } = command.params;

    const api = await this.apiRepository.findOneBy({ id: apiId });

    if (!api) {
      throw new NotFoundException("Api with provided ID not found");
    }

    const endpoint = new Endpoint({ api, path, method, description });

    return await this.endpointRepository.save(endpoint);
  }
}
