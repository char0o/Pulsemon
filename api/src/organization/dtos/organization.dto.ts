import { UserDto } from "src/user/dtos/user.dto";
import { ApiDto } from "src/api/dtos/api.dto";
import { Organization } from "../organization.entity";

export class OrganizationDto {
  constructor(organization: Organization) {
    this.name = organization.name;
    this.description = organization.description;
    this.apis = (organization.apis ?? []).map((api) => new ApiDto(api));
  }
  name: string;
  description: string;
  organizationMembers: UserDto[];
  apis: ApiDto[];
}
