import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateApiDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUrl({ require_protocol: true })
  url: string;

  @ApiProperty()
  description?: string;
}
