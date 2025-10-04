import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { SignUpWithEmailDto } from "./dtos/sign-up-with-email.dto";
import { SignUpWithEmailCommand } from "./commands/sign-up-with-email.command";
import { UserDto } from "src/user/dtos/user.dto";
import type { Request } from "express";
import type { Response } from "express";
import { SignInWithEmailDto } from "./dtos/sign-in-with-email.dto";
import { SignInWithEmailCommand } from "./commands/sign-in-with-email.command";
import { VerifyAuthTokenDto } from "./dtos/verify-auth-token.dto";
import { VerifyAuthTokenCommand } from "./commands/verify-auth-token.command";

@Controller("/auth")
export class AuthController {
  private readonly logger: Logger = new Logger("AuthController");
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  me(@Req() request: Request) {
    const userId = request.session?.userId;

    if (!userId) {
      throw new UnauthorizedException("User is not authenticated");
    }
  }

  @Post("/sign-up")
  @ApiOperation({ summary: "Create a new account" })
  @ApiCreatedResponse({ description: "User succesfully created" })
  @ApiConflictResponse({ description: "Email already in use" })
  @ApiBadRequestResponse({ description: "User is already authenticated" })
  async signUp(@Req() request: Request, @Body(new ValidationPipe()) body: SignUpWithEmailDto) {
    if (request.session?.userId) {
      throw new BadRequestException("User already authenticated");
    }

    const params = {
      email: body.email,
      username: body.username,
    };

    const user = await this.commandBus.execute(new SignUpWithEmailCommand(params));

    return new UserDto(user);
  }

  @Post("/sign-in")
  @ApiOperation({ summary: "Sign in with email" })
  @ApiNoContentResponse({ description: "Verification link sent to email" })
  @ApiNotFoundResponse({ description: "No user with email found" })
  @ApiBadRequestResponse({ description: "User is already authenticated" })
  async signIn(
    @Req() request: Request,
    @Body(new ValidationPipe()) body: SignInWithEmailDto,
  ): Promise<void> {
    if (request.session?.userId) {
      throw new BadRequestException("User already authenticated");
    }

    const params = {
      email: body.email,
    };
    await this.commandBus.execute(new SignInWithEmailCommand(params));
  }

  @Post("/verify-auth-token")
  @ApiOperation({ summary: "Verify the auth token" })
  @ApiOkResponse({ description: "Auth token sucessfully verified" })
  @ApiNotFoundResponse({ description: "Auth token not found or expired" })
  async verifyAuthToken(
    @Req() request: Request,
    @Body(new ValidationPipe()) body: VerifyAuthTokenDto,
  ): Promise<UserDto> {
    const params = {
      token: body.token,
    };

    const user = await this.commandBus.execute(new VerifyAuthTokenCommand(params));

    request.session.userId = user.id;

    return new UserDto(user);
  }

  @Post("/sign-out")
  @ApiOperation({ summary: "Sign out of the current session" })
  signOut(@Req() request: Request, @Res() response: Response) {
    request.session.destroy((err) => {
      if (err) {
        this.logger.error(`Session destroy error: ${err}`);
      }
    });
    response.clearCookie("connect.sid");
    return response.status(200).json({ success: true });
  }
}
