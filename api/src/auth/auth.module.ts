import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { User } from "src/user/user.entity";
import { SignUpWithEmailHandler } from "./commands/sign-up-with-email.command";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SignUpWithEmailHandler],
  controllers: [AuthController],
})
export class AuthModule {}
