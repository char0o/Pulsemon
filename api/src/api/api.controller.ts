import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiOperation,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { EndpointDto } from "src/endpoint/dtos/endpoint.dto";
import { GetApiEndpointsQuery } from "src/endpoint/queries/get-api-endpoints.query";
import { CreateApiDto } from "./dtos/create-api.dto";
import { ApiDto } from "./dtos/api.dto";
import { CreateApiCommand } from "./commands/create-api.command";
import { AuthGuard } from "src/auth/auth.gard";
import type { Request } from "express";

@Controller("/api")
export class ApiController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Get("endpoints")
  @ApiOperation({ summary: "Get a list of all endpoints with the provided API Id" })
  @ApiNotFoundResponse({ description: "No API found with the provided Id" })
  @ApiOkResponse({ description: "List of all endpoints in the API" })
  async getEndpoints(@Param("apiId") apiId: number): Promise<EndpointDto[]> {
    const params = {
      apiId,
    };
    const endpoints = await this.queryBus.execute(new GetApiEndpointsQuery(params));
    return endpoints.map((endpoint) => new EndpointDto(endpoint));
  }

  @Post()
  @ApiOperation({ summary: "Create a new API" })
  @ApiBadRequestResponse({ description: "Provided parameters are not valid" })
  @ApiCreatedResponse({ description: "Api created" })
  async createApi(@Body(new ValidationPipe()) body: CreateApiDto): Promise<ApiDto> {
    const api = await this.commandBus.execute(
      new CreateApiCommand({
        name: body.name,
        url: body.url,
        description: body.description,
      }),
    );

    return new ApiDto(api);
  }
}
