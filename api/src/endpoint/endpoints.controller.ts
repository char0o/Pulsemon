import { Body, Controller, Param, Post, ValidationPipe } from "@nestjs/common";
import { EndpointDto } from "./dtos/endpoint.dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { CreateEndpointDto } from "./dtos/create-endpoint.dto";
import { CreateEndpointCommand } from "./commands/create-endpoint.command";
import { ApiOperation, ApiCreatedResponse, ApiNotFoundResponse } from "@nestjs/swagger";

@Controller("/api")
export class EndpointController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post(":apiId/endpoint")
  @ApiOperation({ summary: "Create a new endpoint with the provided API Id" })
  @ApiCreatedResponse({ description: "Endpoint sucessfully created" })
  @ApiNotFoundResponse({ description: "No API found with the provided id" })
  async createEndpoint(
    @Param("apiId") apiId: number,
    @Body(new ValidationPipe()) body: CreateEndpointDto,
  ): Promise<EndpointDto> {
    const endpoint = await this.commandBus.execute(
      new CreateEndpointCommand({
        apiId: apiId,
        path: body.path,
        method: body.method,
        description: body.description,
      }),
    );

    return new EndpointDto(endpoint);
  }
}
