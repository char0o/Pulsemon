import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { HttpMethods } from "../http-methods.constants";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEndpointDto {
  @ApiProperty({ description: "Path of the endpoint (/api/...)" })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({})
  @IsEnum(HttpMethods)
  method: HttpMethods;

  @ApiProperty()
  description?: string;
}
