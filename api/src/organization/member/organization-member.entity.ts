import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Organization } from "../organization.entity";
import { OrganizationRole } from "../organization-role.constants";
import { User } from "../../user/user.entity";
import { SoftDeleteEntity } from "../../db/base.entity";

@Entity()
export class OrganizationMember extends SoftDeleteEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  organizationId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Organization, { cascade: true })
  organization: Organization;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  joinedAt: Date;

  @Column({ type: "enum", enum: OrganizationRole })
  role: OrganizationRole;

  constructor(params?: Partial<OrganizationMember>) {
    super();
    if (params) {
      Object.assign(this, params);
    }
  }
}
