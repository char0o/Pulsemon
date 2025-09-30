import { Command, CommandBus, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Api } from "../api.entity";
import { Repository } from "typeorm";
import { CreateApiConfigCommand } from "src/api-config/commands/create-api-config.command";
import { CreateApiJobCommand } from "src/api-job/commands/create-api-job.command";

export type CreateApiParams = {
  name: string;
  url: string;
  description?: string;
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

    const api = await this.apiRepository.save(new Api({ name, url, description }));

    await this.commandBus.execute(new CreateApiConfigCommand({ apiId: api.id }));
    await this.commandBus.execute(new CreateApiJobCommand({ apiId: api.id }));

    return api;
  }
}
