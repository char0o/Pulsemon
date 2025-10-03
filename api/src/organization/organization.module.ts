import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./organization.entity";
import { OrganizationMember } from "./member/organization-member.entity";
import { CreateOrganizationHandler } from "./commands/create-organization.command";
import { OrganizationController } from "./organization.controller";
import { User } from "src/user/user.entity";
import { DeleteOrganizationHandler } from "./commands/delete-organization.command";
import { GetOrganizationMembershipHandler } from "./member/queries/get-organizations-membership.query";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationMember, User])],
  providers: [
    CreateOrganizationHandler,
    DeleteOrganizationHandler,
    GetOrganizationMembershipHandler,
  ],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
