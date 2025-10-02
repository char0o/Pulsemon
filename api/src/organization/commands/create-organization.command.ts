import { User } from "src/user/user.entity";
import { Organization } from "../organization.entity";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrganizationMember } from "../member/organization-member.entity";
import { OrganizationRole } from "../organization-role.constants";

export type CreateOrganizationParams = {
  requester: User;
  name: string;
  description?: string;
};

export type CreateOrganizationResult = Organization;

export class CreateOrganizationCommand extends Command<Organization> {
  constructor(public readonly params: CreateOrganizationParams) {
    super();
  }
}

@CommandHandler(CreateOrganizationCommand)
export class CreateOrganizationHandler {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<CreateOrganizationResult> {
    const { requester, name, description } = command.params;

    const organizationMember = new OrganizationMember({
      user: requester,
      userId: requester.id,
      role: OrganizationRole.Owner,
    });
    const organization = new Organization({
      name,
      description,
      organizationMembers: [organizationMember],
    });
    organizationMember.organization = organization;

    await this.organizationMemberRepository.save(organizationMember);

    return organization;
  }
}
