import { Endpoint } from "../endpoint.entity";

export class EndpointDto {
  constructor(endpoint: Endpoint) {
    this.path = endpoint.path;
    this.method = endpoint.method;
    this.description = endpoint.description;
  }
  path: string;
  method: string;
  description: string;
}
