import { Command, CommandHandler } from "@nestjs/cqrs";
import { ApiConfig } from "../api-config.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Api } from "src/api/api.entity";
import { NotFoundException } from "@nestjs/common";
import { DEFAULT_INTERVAL } from "../api-config.constants";

export type CreateApiConfigParams = {
  apiId: number;
  intervalSeconds?: number;
};

export class CreateApiConfigCommand extends Command<ApiConfig> {
  constructor(public readonly params: CreateApiConfigParams) {
    super();
  }
}

@CommandHandler(CreateApiConfigCommand)
export class CreateApiConfigHandler {
  constructor(
    @InjectRepository(ApiConfig)
    private readonly apiConfigRepository: Repository<ApiConfig>,
    @InjectRepository(Api)
    private readonly apirepository: Repository<Api>,
  ) {}

  async execute(command: CreateApiConfigCommand): Promise<void> {
    const { apiId, intervalSeconds } = command.params;

    const api = await this.apirepository.findOneBy({ id: apiId });

    if (!api) {
      throw new NotFoundException("No API found with the provided id");
    }

    const interval = intervalSeconds ?? DEFAULT_INTERVAL;
    const apiConfig = new ApiConfig({ api, intervalSeconds: interval });
    console.log(apiConfig);
    await this.apiConfigRepository.save(apiConfig);
  }
}
