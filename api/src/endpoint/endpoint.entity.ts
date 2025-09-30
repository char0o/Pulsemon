import { BaseEntity } from "../db/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { HttpMethods } from "./http-methods.constants";
import { Api } from "../api/api.entity";

@Entity()
export class Endpoint extends BaseEntity {
  @Column()
  path: string;

  @Column()
  method: HttpMethods;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Api, (api) => api.endpoints, { onDelete: "CASCADE" })
  api: Api;

  constructor(params?: Partial<Endpoint>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
