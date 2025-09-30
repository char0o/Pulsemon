import { Api } from "../api/api.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ApiJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  apiId: number;

  @OneToOne(() => Api)
  @JoinColumn({ name: "apiId" })
  api: Api;

  @Column()
  intervalSeconds: number;

  @Column({ nullable: true })
  lastRun: Date;

  constructor(params?: Partial<ApiJob>) {
    if (params) {
      Object.assign(this, params);
    }
  }
}
