import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./organization.entity";
import { OrganizationMember } from "./member/organization-member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Organization, OrganizationMember])],
  providers: [],
  exports: [],
})
export class OrganizationModule {}
