import { InjectRepository } from "@nestjs/typeorm";
import { ApiJob } from "../api-job.entity";
import { Repository } from "typeorm";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { Api } from "src/api/api.entity";

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
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
  ) {}

  async execute(command: CreateApiJobCommand): Promise<ApiJob> {
    const { apiId } = command.params;

    const api = await this.apiRepository.findOneBy({ id: apiId });

    if (!api) {
      throw new NotFoundException("No API config found with the provided ID");
    }

    const apiJob = new ApiJob({
      api: api,
      apiId: api.id,
      intervalSeconds: api.callIntervalSeconds,
      lastRun: new Date(),
    });

    return await this.apiJobRepository.save(apiJob);
  }
}
