import { MigrationInterface, QueryRunner } from "typeorm";

export class Api1759367450590 implements MigrationInterface {
    name = 'Api1759367450590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "api" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "url" character varying NOT NULL, "description" character varying, "callIntervalSeconds" integer NOT NULL, CONSTRAINT "PK_12f6cbe9e79197c2bf4c79c009d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_metric" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "responseTime" integer NOT NULL, "statusCode" integer NOT NULL, "errorMessage" character varying, "endpointId" integer, CONSTRAINT "PK_91f34f4a9b0c2ac12280003bd7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "path" character varying NOT NULL, "method" character varying NOT NULL, "description" character varying, "apiId" integer, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_job" ("id" SERIAL NOT NULL, "apiId" integer NOT NULL, "intervalSeconds" integer NOT NULL, "lastRun" TIMESTAMP, CONSTRAINT "REL_913f2df8284ee323193f1e0350" UNIQUE ("apiId"), CONSTRAINT "PK_d53e0b15f813c580027633fbeee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deletedById" integer, "email" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "api_metric" ADD CONSTRAINT "FK_1275f0f91fa0c2975f1cd1a0b0e" FOREIGN KEY ("endpointId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_job" ADD CONSTRAINT "FK_913f2df8284ee323193f1e03503" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_job" DROP CONSTRAINT "FK_913f2df8284ee323193f1e03503"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701"`);
        await queryRunner.query(`ALTER TABLE "api_metric" DROP CONSTRAINT "FK_1275f0f91fa0c2975f1cd1a0b0e"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "api_job"`);
        await queryRunner.query(`DROP TABLE "endpoint"`);
        await queryRunner.query(`DROP TABLE "api_metric"`);
        await queryRunner.query(`DROP TABLE "api"`);
    }

}
