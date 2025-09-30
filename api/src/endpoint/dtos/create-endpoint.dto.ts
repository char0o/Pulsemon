import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiMethods } from "../api-method.constants";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEndpointDto {
  @ApiProperty({ description: "Path of the endpoint (/api/...)" })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({})
  @IsEnum(ApiMethods)
  method: ApiMethods;

  @ApiProperty()
  description?: string;
}
