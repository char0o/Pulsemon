import { OrganizationRole } from "./organization-role.constants";
import { OrganizationMember } from "./member/organization-member.entity";

export function userHasOrganizationRole(
  member: OrganizationMember,
  role: OrganizationRole,
): boolean {
  return member.role <= role;
}
