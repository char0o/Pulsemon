import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.gard";
import { CreateOrganizationDto } from "./dtos/create-organization.dto";
import type { Request } from "express";
import { OrganizationDto } from "./dtos/organization.dto";
import { CreateOrganizationCommand } from "./commands/create-organization.command";
import { QueryBus, CommandBus } from "@nestjs/cqrs";
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from "@nestjs/swagger";
import { DeleteOrganizationCommand } from "./commands/delete-organization.command";
import { GetOrganizationMembershipQuery } from "./member/queries/get-organizations-membership.query";

@Controller("/organization")
export class OrganizationController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: "Create a new organization." })
  @ApiCreatedResponse({ description: "Organization sucessfully created" })
  async createOrganization(
    @Req() request: Request,
    @Body(new ValidationPipe()) body: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    const params = {
      requester: request.requester,
      name: body.name,
      description: body.description,
    };

    const organization = await this.commandBus.execute(new CreateOrganizationCommand(params));

    return new OrganizationDto(organization);
  }

  @UseGuards(AuthGuard)
  @Delete(":organizationId")
  @ApiOperation({ summary: "Delete an organization" })
  @ApiOkResponse({ description: "Organization deleted succesfully" })
  @ApiUnauthorizedResponse({ description: "User is not authorized to delete the organization" })
  @ApiForbiddenResponse({ description: "User doesn't have the role to delete the organization" })
  async deleteOrganization(
    @Req() request: Request,
    @Param("organizationId") organizationId: number,
  ) {
    const params = {
      requester: request.requester,
      organizationId: +organizationId,
    };

    const result = this.commandBus.execute(new DeleteOrganizationCommand(params));

    return result;
  }

  @UseGuards(AuthGuard)
  @Get("/membership")
  async getOrganizationMembership(@Req() request: Request): Promise<OrganizationDto[]> {
    const params = { requester: request.requester };
    const organizations = await this.queryBus.execute(new GetOrganizationMembershipQuery(params));

    return organizations.map((organization) => new OrganizationDto(organization));
  }
}
