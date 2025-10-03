import { Injectable } from "@nestjs/common";
import path from "path";
import { OrganizationMember } from "../organization/member/organization-member.entity";
import { Organization } from "../organization/organization.entity";
import { User } from "../user/user.entity";
import { DataSource, EntityTarget } from "typeorm";
import * as fs from "fs";

interface SeedItem<T> {
  name: string;
  object: T;
}

const seedingOrder = [User, Organization, OrganizationMember];

@Injectable()
export class SeedingService {
  private seedFolder = path.join(__dirname, "./seeds");
  private lookupTable = new Map<string, any>();

  constructor(private readonly dataSource: DataSource) {}

  async seedAll() {
    for (const entityClass of seedingOrder) {
      const fileName = entityClass.name.toLowerCase();

      const jsonPath = path.join(__dirname, `./seeds/${fileName}.json`);
      const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as SeedItem<any>[];

      if (!Array.isArray(jsonData)) {
        console.error(`Seed file for ${entityClass.name} is not an array!`);
        continue;
      }

      await this.seedEntity(entityClass, jsonData);
    }
  }

  async seedEntity<T extends object>(entityClass: EntityTarget<T>, items: SeedItem<T>[]) {
    const repository = this.dataSource.getRepository(entityClass);

    for (const item of items) {
      const safeItem = { ...item.object } as Record<string, unknown>;
      for (const [key, value] of Object.entries(safeItem)) {
        const relation = repository.metadata.findRelationWithPropertyPath(key);

        if (relation && typeof value === "string") {
          const relatedEntity = this.lookupTable.get(value) as T;
          if (!relatedEntity) {
            throw new Error(`Couldnt not find related entity for ${key}, ${value}`);
          }
          safeItem[key] = relatedEntity;
        }
      }
      const entity = repository.create(safeItem as T);
      await repository.save(entity);

      this.lookupTable.set((item as SeedItem<any>).name, entity);
    }
  }

  async clearDatabase() {
    for (const entity of [OrganizationMember, User, Organization]) {
      const repository = this.dataSource.getRepository(entity);
      await this.dataSource.query(
        `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`,
      );
    }

    this.lookupTable.clear();
  }

  getEntity<T>(alias: string): T {
    if (!this.lookupTable.has(alias)) {
      throw new Error(`Alias ${alias} not found in seeded entities`);
    }

    return this.lookupTable.get(alias) as T;
  }
}
