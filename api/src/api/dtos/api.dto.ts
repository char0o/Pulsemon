import { EndpointDto } from "src/endpoint/dtos/endpoint.dto";
import { Api } from "../api.entity";
import { OrganizationDto } from "src/organization/dtos/organization.dto";

export class ApiDto {
  constructor(api: Api) {
    this.name = api.name;
    this.url = api.url;
    this.description = api.description;
    this.endpoints = api.endpoints
      ? api.endpoints.map((endpoint) => new EndpointDto(endpoint))
      : undefined;
    this.organization = new OrganizationDto(api.organization);
  }
  name: string;
  url: string;
  description: string;
  endpoints: EndpointDto[] | undefined;
  organization: OrganizationDto;
}
