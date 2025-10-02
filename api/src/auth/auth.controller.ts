import { Body, Controller, Logger, Post, Req, Res, ValidationPipe } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
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

  @Post("/sign-in")
  @ApiOperation({ summary: "Sign in with email" })
  @ApiNoContentResponse({ description: "Verification link sent to email" })
  @ApiNotFoundResponse({ description: "No user with email found" })
  async signIn(@Body(new ValidationPipe()) body: SignInWithEmailDto): Promise<void> {
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
