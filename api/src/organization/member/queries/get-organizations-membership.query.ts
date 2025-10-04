import { Query, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "src/organization/organization.entity";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { OrganizationMember } from "../organization-member.entity";

export type GetOrganizationsMembershipParams = {
  requester: User;
};

export type GetOrganizationMemberShipResult = Organization[];

export class GetOrganizationMembershipQuery extends Query<Organization[]> {
  constructor(public readonly params: GetOrganizationsMembershipParams) {
    super();
  }
}

@QueryHandler(GetOrganizationMembershipQuery)
export class GetOrganizationMembershipHandler {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(query: GetOrganizationMembershipQuery): Promise<GetOrganizationMemberShipResult> {
    const { requester } = query.params;

    const organizationMembers = await this.organizationMemberRepository.find({
      where: { userId: requester.id },
      relations: ["organization"],
    });

    return organizationMembers.map((organizationMember) => organizationMember.organization);
  }
}
