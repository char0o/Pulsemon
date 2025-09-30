import { Api } from "../api/api.entity";
import { BaseEntity } from "../db/base.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity()
export class ApiConfig extends BaseEntity {
  @OneToOne(() => Api)
  @JoinColumn()
  api: Api;

  @Column()
  intervalSeconds: number;

  constructor(params?: Partial<ApiConfig>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
