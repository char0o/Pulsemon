import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SignInWithEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
