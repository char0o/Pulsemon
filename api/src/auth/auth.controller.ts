import { Body, Controller, Post, Req, ValidationPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiConflictResponse, ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { SignUpWithEmailDto } from "./dtos/sign-up-with-email.dto";
import { SignUpWithEmailCommand } from "./commands/sign-up-with-email.command";
import { UserDto } from "src/user/dtos/user.dto";
import type { Request } from "express";

@Controller("/auth")
export class AuthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post("/sign-up")
  @ApiOperation({ summary: "Create a new account" })
  @ApiCreatedResponse({ description: "User succesfully created" })
  @ApiConflictResponse({ description: "Email already in use" })
  async signUp(@Req() request: Request, @Body(new ValidationPipe()) body: SignUpWithEmailDto) {
    const params = {
      email: body.email,
      username: body.username,
    };

    const user = await this.commandBus.execute(new SignUpWithEmailCommand(params));

    request.session.userId = user.id;

    return new UserDto(user);
  }
}
