import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { OrganizationMember } from "src/organization/member/organization-member.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, OrganizationMember])],
  providers: [],
  exports: [],
})
export class UserModule {}
