import { OrganizationMember } from "../organization/member/organization-member.entity";
import { SoftDeleteEntity } from "../db/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends SoftDeleteEntity {
  @Column()
  email: string;

  @Column()
  username: string;

  @OneToMany(() => OrganizationMember, (organizationMember) => organizationMember.user)
  organizationMember: OrganizationMember[];

  constructor(params?: Partial<User>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
