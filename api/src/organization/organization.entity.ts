import { SoftDeleteEntity } from "../db/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { OrganizationMember } from "./member/organization-member.entity";
import { Api } from "../api/api.entity";

@Entity()
export class Organization extends SoftDeleteEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => OrganizationMember, (organizationMember) => organizationMember.organization)
  organizationMembers: OrganizationMember[];

  @OneToMany(() => Api, (api) => api.organization)
  apis: Api[];

  constructor(params?: Partial<Organization>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
