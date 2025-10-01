import { Api } from "src/api/api.entity";
import { ApiMetric } from "../api-metric.entity";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export type CreateApiMetricParams = {
  api: Api;
  responseTime: number;
  statusCode: number;
  errorMessage?: string;
};

export type CreateApiMetricResult = ApiMetric;

export class CreateApiMetricCommand extends Command<ApiMetric> {
  constructor(public readonly params: CreateApiMetricParams) {
    super();
  }
}

@CommandHandler(CreateApiMetricCommand)
export class CreateApiMetricHandler {
  constructor(
    @InjectRepository(ApiMetric)
    private readonly apiMetricRepository: Repository<ApiMetric>,
  ) {}

  async execute(command: CreateApiMetricCommand): Promise<ApiMetric> {
    const { api, responseTime, statusCode, errorMessage } = command.params;

    const apiMetric = new ApiMetric({ api, responseTime, statusCode, errorMessage });

    return await this.apiMetricRepository.save(apiMetric);
  }
}
