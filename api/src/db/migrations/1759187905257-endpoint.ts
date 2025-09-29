import { MigrationInterface, QueryRunner } from 'typeorm';

export class Endpoint1759187905257 implements MigrationInterface {
  name = 'Endpoint1759187905257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "endpoint" ("id" SERIAL NOT NULL, "path" character varying NOT NULL, "method" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "endpoint"`);
  }
}
