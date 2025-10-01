import { Endpoint } from "../endpoint/endpoint.entity";
import { BaseEntity } from "../db/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class ApiMetric extends BaseEntity {
  @ManyToOne(() => Endpoint, (endpoint) => endpoint.metrics, { onDelete: "CASCADE" })
  endpoint: Endpoint;

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
