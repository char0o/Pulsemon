import { MigrationInterface, QueryRunner } from "typeorm";

export class EndpointAndApi1759241297678 implements MigrationInterface {
    name = 'EndpointAndApi1759241297678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "name"`);
    }

}
