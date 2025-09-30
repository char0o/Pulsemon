import { MigrationInterface, QueryRunner } from "typeorm";

export class Api1759251498751 implements MigrationInterface {
    name = 'Api1759251498751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_12f6cbe9e79197c2bf4c79c009d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "path" character varying NOT NULL, "method" character varying NOT NULL, "description" character varying, "apiId" integer, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_job" ("id" SERIAL NOT NULL, "apiId" integer NOT NULL, "intervalSeconds" integer NOT NULL, "lastRun" TIMESTAMP, CONSTRAINT "REL_913f2df8284ee323193f1e0350" UNIQUE ("apiId"), CONSTRAINT "PK_d53e0b15f813c580027633fbeee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_config" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "intervalSeconds" integer NOT NULL, "apiId" integer, CONSTRAINT "REL_b7ba877debe922e40c0e850c02" UNIQUE ("apiId"), CONSTRAINT "PK_cddfd22e3898abc34b45f9dbce4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_job" ADD CONSTRAINT "FK_913f2df8284ee323193f1e03503" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_config" ADD CONSTRAINT "FK_b7ba877debe922e40c0e850c021" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_config" DROP CONSTRAINT "FK_b7ba877debe922e40c0e850c021"`);
        await queryRunner.query(`ALTER TABLE "api_job" DROP CONSTRAINT "FK_913f2df8284ee323193f1e03503"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701"`);
        await queryRunner.query(`DROP TABLE "api_config"`);
        await queryRunner.query(`DROP TABLE "api_job"`);
        await queryRunner.query(`DROP TABLE "endpoint"`);
        await queryRunner.query(`DROP TABLE "api"`);
    }

}
