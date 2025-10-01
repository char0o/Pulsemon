import { Api } from "../api/api.entity";
import { BaseEntity } from "../db/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class ApiMetric extends BaseEntity {
  @ManyToOne(() => Api, (api) => api.metrics, { onDelete: "CASCADE" })
  api: Api;

  @Column()
  responseTime: number;

  @Column()
  statusCode: number;

  @Column({ nullable: true })
  errorMessage: string;

  constructor(params?: Partial<ApiMetric>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
