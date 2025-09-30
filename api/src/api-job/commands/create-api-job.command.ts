import { InjectRepository } from "@nestjs/typeorm";
import { ApiJob } from "../api-job.entity";
import { Repository } from "typeorm";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { ApiConfig } from "src/api-config/api-config.entity";

export type CreateApiJobParams = {
  apiId: number;
};

export type CreateApiJobResult = ApiJob;

export class CreateApiJobCommand extends Command<ApiJob> {
  constructor(public readonly params: CreateApiJobParams) {
    super();
  }
}

@CommandHandler(CreateApiJobCommand)
export class CreateApiJobHandler {
  constructor(
    @InjectRepository(ApiJob)
    private readonly apiJobRepository: Repository<ApiJob>,
    @InjectRepository(ApiConfig)
    private readonly apiConfigRepository: Repository<ApiConfig>,
  ) {}

  async execute(command: CreateApiJobCommand): Promise<ApiJob> {
    const { apiId } = command.params;

    const apiConfig = await this.apiConfigRepository.findOne({
      where: { id: apiId },
      relations: ["api"],
    });

    if (!apiConfig) {
      throw new NotFoundException("No API config found with the provided ID");
    }

    const apiJob = new ApiJob({
      api: apiConfig.api,
      apiId: apiConfig.api.id,
      intervalSeconds: apiConfig.intervalSeconds,
      lastRun: new Date(),
    });

    return await this.apiJobRepository.save(apiJob);
  }
}
