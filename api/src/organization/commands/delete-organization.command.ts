import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "../organization.entity";
import { Repository } from "typeorm";
import { OrganizationMember } from "../member/organization-member.entity";
import { Command, CommandHandler } from "@nestjs/cqrs";
import { User } from "src/user/user.entity";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { userHasOrganizationRole } from "../organization-role.utils";
import { OrganizationRole } from "../organization-role.constants";

export type DeleteOrganizationParams = {
  requester: User;
  organizationId: number;
};

export type DeleteOrganizationResult = {
  sucess: boolean;
};

export class DeleteOrganizationCommand extends Command<DeleteOrganizationResult> {
  constructor(public readonly params: DeleteOrganizationParams) {
    super();
  }
}

@CommandHandler(DeleteOrganizationCommand)
export class DeleteOrganizationHandler {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
  ) {}

  async execute(command: DeleteOrganizationCommand): Promise<DeleteOrganizationResult> {
    const { requester, organizationId } = command.params;

    const organization = await this.organizationRepository.findOne({
      where: {
        id: organizationId,
        organizationMembers: { id: requester.id },
      },
      relations: ["organizationMembers"],
    });

    if (!organization) {
      throw new NotFoundException("No organization found with provided id");
    }

    const member = organization.organizationMembers[0];

    if (!userHasOrganizationRole(member, OrganizationRole.Owner)) {
      throw new ForbiddenException("User doesn't have the right to delete the organization");
    }

    await this.organizationMemberRepository.softDelete({ organizationId: organization.id });
    await this.organizationRepository.softDelete({ id: organization.id });

    return { sucess: true };
  }
}
