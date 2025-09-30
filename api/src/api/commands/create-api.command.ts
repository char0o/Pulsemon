import { Command, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Api } from "../api.entity";
import { Repository } from "typeorm";

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
  ) {}

  async execute(command: CreateApiCommand): Promise<CreateApiResult> {
    const { name, url, description } = command.params;

    return await this.apiRepository.save(new Api({ name, url, description }));
  }
}
