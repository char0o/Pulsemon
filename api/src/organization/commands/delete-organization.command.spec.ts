import { Test, TestingModule } from "@nestjs/testing";
import {
  DeleteOrganizationCommand,
  DeleteOrganizationHandler,
} from "./delete-organization.command";
import { SeedingService } from "../../seeding/seeding-service";
import { dbModule } from "../../db/postgres";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "../organization.entity";
import { User } from "../../user/user.entity";
import { OrganizationMember } from "../member/organization-member.entity";
import { DataSource } from "typeorm";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

describe("DeleteOrganizationHandler", () => {
  let handler: DeleteOrganizationHandler;
  let seedingService: SeedingService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedingService, DeleteOrganizationHandler],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        dbModule,
        TypeOrmModule.forFeature([Organization, User, OrganizationMember]),
      ],
    }).compile();

    handler = module.get(DeleteOrganizationHandler);
    seedingService = module.get(SeedingService);
    dataSource = module.get(DataSource);
  });

  beforeEach(async () => {
    await seedingService.clearDatabase();
    await seedingService.seedAll();
  });

  afterAll(async () => {
    await seedingService.clearDatabase();
    await dataSource.destroy();
  });

  it("should delete organization if user is owner", async () => {
    const user = seedingService.getEntity<User>("Charo");
    const org = seedingService.getEntity<Organization>("Pulsemon");

    const params = {
      requester: user,
      organizationId: org.id,
    };

    const command = new DeleteOrganizationCommand(params);

    const result = await handler.execute(command);
    expect(result.sucess).toBe(true);

    const deletedOrg = await dataSource
      .getRepository(Organization)
      .findOne({ where: { id: org.id }, withDeleted: true });
    expect(deletedOrg?.deletedAt).toBeDefined();

    const deletedMember = await dataSource
      .getRepository(OrganizationMember)
      .findOne({ where: { organizationId: org.id, userId: user.id }, withDeleted: true });
    expect(deletedMember?.deletedAt).toBeDefined();
  });

  it("should throw Forbidden exception if member doesn't have role", async () => {
    const user = seedingService.getEntity<User>("Bob");
    const org = seedingService.getEntity<Organization>("Pulsemon");

    const params = {
      requester: user,
      organizationId: org.id,
    };

    const command = new DeleteOrganizationCommand(params);

    await expect(handler.execute(command)).rejects.toThrow(ForbiddenException);
  });

  it("should throw NotFoundException if user not member of organisation", async () => {
    const user = seedingService.getEntity<User>("Richard");
    const org = seedingService.getEntity<Organization>("Pulsemon");

    const params = {
      requester: user,
      organizationId: org.id,
    };

    const command = new DeleteOrganizationCommand(params);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
