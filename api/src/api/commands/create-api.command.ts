import { Command, CommandBus, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Api } from "../api.entity";
import { Repository } from "typeorm";
import { CreateApiJobCommand } from "src/api-job/commands/create-api-job.command";
import { DEFAULT_CALL_INTERVAL } from "../api.constants";

export type CreateApiParams = {
  name: string;
  url: string;
  description?: string;
  organizationId: number;
};

export type CreateApiResult = Api;

export class CreateApiCommand extends Command<Api> {
  constructor(public readonly params: CreateApiParams) {
    super();
  }
}

@CommandHandler(CreateApiCommand)
export class CreateApiHandler {
  constructor(
    @InjectRepository(Api)
    private readonly apiRepository: Repository<Api>,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: CreateApiCommand): Promise<CreateApiResult> {
    const { name, url, description } = command.params;

    const api = await this.apiRepository.save(
      new Api({ name, url, description, callIntervalSeconds: DEFAULT_CALL_INTERVAL }),
    );

    await this.commandBus.execute(new CreateApiJobCommand({ apiId: api.id }));

    return api;
  }
}
