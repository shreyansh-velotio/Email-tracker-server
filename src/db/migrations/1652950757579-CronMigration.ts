import {MigrationInterface, QueryRunner} from "typeorm";

export class CronMigration1652950757579 implements MigrationInterface {
    name = 'CronMigration1652950757579'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cron" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_2bd2e0a051c553ce710865305a1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cron"`);
    }

}
