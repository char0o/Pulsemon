import { BaseEntity } from "../db/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ApiMethods } from "./api-method.constants";
import { Api } from "../api/api.entity";

@Entity()
export class Endpoint extends BaseEntity {
  @Column()
  path: string;

  @Column()
  method: ApiMethods;

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
