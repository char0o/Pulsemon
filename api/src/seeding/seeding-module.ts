import { SeedingService } from "./seeding-service";
import { User } from "../user/user.entity";
import { Organization } from "../organization/organization.entity";
import { OrganizationMember } from "../organization/member/organization-member.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization, OrganizationMember])],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
