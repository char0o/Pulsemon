import { Organization } from "../organization/organization.entity";
import { BaseEntity } from "../db/base.entity";
import { Endpoint } from "../endpoint/endpoint.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Api extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  callIntervalSeconds: number;

  @OneToMany(() => Endpoint, (endpoint) => endpoint.api)
  endpoints: Endpoint[];

  @ManyToOne(() => Organization, (org) => org.apis)
  organization: Organization;

  constructor(params?: Partial<Api>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
