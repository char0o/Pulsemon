import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { User } from "src/user/user.entity";
import { SignUpWithEmailHandler } from "./commands/sign-up-with-email.command";
import { SignInWithEmailHandler } from "./commands/sign-in-with-email.command";
import { VerifyAuthTokenHandler } from "./commands/verify-auth-token.command";
import { CreateAuthTokenHandler } from "src/auth/commands/create-auth-token.command";
import { ValidateSessionHandler } from "./commands/validate-session.command";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    SignUpWithEmailHandler,
    SignInWithEmailHandler,
    VerifyAuthTokenHandler,
    CreateAuthTokenHandler,
    ValidateSessionHandler,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
