import { SoftDeleteEntity } from "../db/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends SoftDeleteEntity {
  @Column()
  email: string;

  @Column()
  username: string;

  constructor(params?: Partial<User>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
